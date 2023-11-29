import { minLength, object, string, Output } from 'valibot'

export const configSchema = object({
  title: string([minLength(1, 'Please enter your app title')]),
  repo: string([minLength(1, 'Please enter your app repo')]),
  extraQuery: string(),
})

export type Config = Output<typeof configSchema>
