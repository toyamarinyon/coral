import { minLength, object, parse, string, flatten } from 'valibot'

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
    throw new Error(
      `Please check your .env file. ${JSON.stringify(flatten(error))}`,
    )
  }
}

export const env = parseEnv()
