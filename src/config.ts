import { minLength, object, string, Output } from 'valibot'

export const configSchema = object({
  authToken: string([minLength(1, 'Please enter your GitHub auth token')]),
  title: string([minLength(1, 'Please enter your app title')]),
  repo: string([minLength(1, 'Please enter your app repo')]),
})

export type Config = Output<typeof configSchema>
