import {
  ApolloClient,
  ApolloProvider as OriginalApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
  ServerError,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { relayStylePagination } from '@apollo/client/utilities'
import { PropsWithChildren, Suspense, useMemo } from 'react'
import { match } from 'ts-pattern'

export type NetWorkErrorHandler = (netWorkError: ServerError) => void
interface Props {
  onNetworkError: NetWorkErrorHandler
}
export const ApolloProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  onNetworkError,
}) => {
  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: `${location.protocol}//${location.host}/graphql`,
    })

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        )
      if (networkError) {
        match(networkError.name)
          .with('ServerError', () => {
            onNetworkError(networkError as ServerError)
          })
          .otherwise(() => {
            console.log(`[Unhandled network error]: ${networkError}`)
          })
      }
    })

    const client = new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              search: relayStylePagination(['query']),
            },
          },
        },
      }),
    })
    return client
  }, [onNetworkError])
  return (
    <OriginalApolloProvider client={client}>
      <Suspense>{children}</Suspense>
    </OriginalApolloProvider>
  )
}
