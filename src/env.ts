import { minLength, object, parse, string, flatten, ValiError } from 'valibot'

const envSchema = object({
  VITE_APP_TITLE: string([minLength(1, 'Please enter your app title')]),
  VITE_APP_REPO: string([minLength(1, 'Please enter your app repo')]),
  VITE_APP_TOKEN: string([minLength(1, 'Please enter your GitHub auth token')]),
})

export const parseEnv = () => {
  try {
    return parse(
      envSchema,
      typeof window === 'undefined' ? process.env : import.meta.env,
    )
  } catch (error) {
    if (error instanceof ValiError) {
      throw new Error(
        // @tslint:disable-next-line: no-any
        `Please check your .env file. ${JSON.stringify(flatten(error))}`,
      )
    }
    throw new Error('unexpected error')
  }
}

export const env = parseEnv()
