import { Config } from './config'
import { ApolloProvider, NetWorkErrorHandler } from './contexts'
import { useConfig, useRouter } from './hooks/'
import { ConfigurationForm, Feed } from './screens'
import { useCallback, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { match } from 'ts-pattern'

export const App: React.FC = () => {
  const [config, setConfig] = useConfig()
  const [route, setRoute] = useRouter()
  const handleSubmit = useCallback(
    (newConfig: Config) => {
      setConfig(newConfig)
      setRoute('feed')
    },
    [setConfig, setRoute],
  )
  const goToConfigurationForm = useCallback(
    () => setRoute('setting'),
    [setRoute],
  )
  const handleNetworkError = useCallback<NetWorkErrorHandler>(
    (error) => {
      if (error.statusCode === 401) {
        toast('Invalid token')
      }
      setRoute('setting')
    },
    [setRoute],
  )
  useEffect(() => {
    if (config.state === 'configured') {
      document.title = config.title
    }
  }, [config])

  return (
    <>
      {match([config, route])
        .with(
          [{ state: 'configured' }, 'feed'],
          ([{ repo, authToken, title, extraQuery }]) => (
            <ApolloProvider
              authToken={authToken}
              onNetworkError={handleNetworkError}
            >
              <Feed
                title={title}
                repo={repo}
                extraQuery={extraQuery}
                goToConfigurationForm={goToConfigurationForm}
              />
            </ApolloProvider>
          ),
        )
        .with(
          [{ state: 'configured' }, 'setting'],
          ([{ repo, authToken, title, extraQuery }]) => (
            <ConfigurationForm
              onSubmit={handleSubmit}
              defaultValues={{
                repo,
                authToken,
                title,
                extraQuery,
              }}
            />
          ),
        )
        .otherwise(() => (
          <ConfigurationForm onSubmit={handleSubmit} />
        ))}
      <Toaster />
    </>
  )
}
