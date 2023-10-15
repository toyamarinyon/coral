import { Config } from '../config'
import {
  ApolloClient,
  ApolloProvider as OriginalApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
  ServerError,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { relayStylePagination } from '@apollo/client/utilities'
import { PropsWithChildren, Suspense, useMemo } from 'react'
import { match } from 'ts-pattern'

export type NetWorkErrorHandler = (netWorkError: ServerError) => void
interface Props {
  onNetworkError: NetWorkErrorHandler
}
export const ApolloProvider: React.FC<
  PropsWithChildren<Pick<Config, 'authToken'> & Props>
> = ({ authToken, children, onNetworkError }) => {
  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: 'https://api.github.com/graphql',
    })

    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${authToken}`,
        },
      }
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
      link: from([errorLink, authLink, httpLink]),
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
  }, [authToken, onNetworkError])
  return (
    <OriginalApolloProvider client={client}>
      <Suspense>{children}</Suspense>
    </OriginalApolloProvider>
  )
}
