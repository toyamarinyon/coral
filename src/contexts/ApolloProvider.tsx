import { Config } from '../config'
import {
  ApolloClient,
  ApolloProvider as OriginalApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { relayStylePagination } from '@apollo/client/utilities'
import { PropsWithChildren, Suspense, useMemo } from 'react'

export const ApolloProvider: React.FC<
  PropsWithChildren<Pick<Config, 'authToken'>>
> = ({ authToken, children }) => {
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

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
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
  }, [authToken])
  return (
    <OriginalApolloProvider client={client}>
      <Suspense>{children}</Suspense>
    </OriginalApolloProvider>
  )
}
