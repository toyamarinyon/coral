import { Config } from '../config'
import { useState } from 'react'

type ConfigState =
  | ({ state: 'configured' } & Config)
  | { state: 'unconfigured' }
export const useConfig = (): [ConfigState, (config: Config) => void] => {
  const [config, _setConfig] = useState<Config>({
    authToken: localStorage.getItem('authToken') || '',
    title: localStorage.getItem('title') || '',
    repo: localStorage.getItem('repo') || '',
  })
  const setConfig = (config: Config) => {
    localStorage.setItem('authToken', config.authToken)
    localStorage.setItem('title', config.title)
    localStorage.setItem('repo', config.repo)
    _setConfig(config)
  }
  const isConfigured =
    config.authToken !== '' && config.title !== '' && config.repo !== ''
  if (isConfigured) {
    return [
      {
        state: 'configured',
        ...config,
      },
      setConfig,
    ]
  }
  return [
    {
      state: 'unconfigured',
    },
    setConfig,
  ]
}
