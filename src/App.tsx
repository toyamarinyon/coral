import { Config } from './config'
import { ApolloProvider } from './contexts'
import { useConfig, useRouter } from './hooks/'
import { ConfigurationForm, Feed } from './screens'
import { useCallback } from 'react'
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
  return match([config, route])
    .with([{ state: 'configured' }, 'feed'], ([{ repo, authToken, title }]) => (
      <ApolloProvider authToken={authToken}>
        <Feed
          title={title}
          repo={repo}
          goToConfigurationForm={goToConfigurationForm}
        />
      </ApolloProvider>
    ))
    .with(
      [{ state: 'configured' }, 'setting'],
      ([{ repo, authToken, title }]) => (
        <ConfigurationForm
          onSubmit={handleSubmit}
          defaultValues={{
            repo,
            authToken,
            title,
          }}
        />
      ),
    )
    .otherwise(() => <ConfigurationForm onSubmit={handleSubmit} />)
}
