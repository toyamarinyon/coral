import { Config } from '../config'
import { useState } from 'react'

type ConfigState =
  | ({ state: 'configured' } & Config)
  | { state: 'unconfigured' }
export const useConfig = (): [ConfigState, (config: Config) => void] => {
  const [config, _setConfig] = useState<Config>({
    title: localStorage.getItem('title') || '',
    repo: localStorage.getItem('repo') || '',
    extraQuery: localStorage.getItem('extraQuery') || '',
  })
  const setConfig = (config: Config) => {
    localStorage.setItem('title', config.title)
    localStorage.setItem('repo', config.repo)
    localStorage.setItem('extraQuery', config.extraQuery)
    _setConfig(config)
  }
  const isConfigured = config.title !== '' && config.repo !== ''
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
