import { Field } from '../components'
import { Config, configSchema } from '../config'
import * as Form from '@radix-ui/react-form'
import { FormEventHandler, useCallback } from 'react'
import { parse } from 'valibot'

interface Props {
  defaultValues?: Config
  onSubmit: (values: Config) => void
}
export const ConfigurationForm: React.FC<Props> = ({
  onSubmit,
  defaultValues,
}) => {
  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault()
      const rawData = Object.fromEntries(new FormData(event.currentTarget))
      const data = parse(configSchema, rawData)
      onSubmit(data)
    },
    [onSubmit],
  )
  return (
    <main className="mx-auto flex h-screen items-center justify-center">
      <div className="flex space-x-4">
        <div className="flex w-[400px] items-center space-x-2">
          <div>
            <p className="text-3xl font-bold">
              Thank you for running this app!
            </p>
            <p className="text-xl">
              Please fill out the form right to get started.
            </p>
          </div>
        </div>

        <Form.Root onSubmit={handleSubmit} className="w-[400px]">
          <Field
            name="authToken"
            label="Access Token"
            defaultValue={defaultValues?.authToken}
          />
          <Field
            name="title"
            label="Title"
            defaultValue={defaultValues?.title}
          />
          <Field
            name="repo"
            label="Repository"
            defaultValue={defaultValues?.repo}
          />
          <Form.Submit asChild>
            <button className="mt-[10px] box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-rosePineDawn-overlay px-[15px] font-medium leading-none text-rosePineDawn-text focus:outline-none">
              Save
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </main>
  )
}
