import { Field, ServerError } from '../../components'
import { Config, configSchema } from '../../config'
import { StarIcon } from '@heroicons/react/24/solid'
import * as Form from '@radix-ui/react-form'
import { FormEventHandler, useCallback, useState } from 'react'
import { parse } from 'valibot'

interface Props {
  defaultValues?: Config
  onSubmit: (values: Config) => void
}
export const ConfigurationForm: React.FC<Props> = ({
  onSubmit,
  defaultValues,
}) => {
  const [ghTokenError, setGhTokenError] = useState<ServerError | null>(null)
  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      const rawData = Object.fromEntries(new FormData(event.currentTarget))
      const data = parse(configSchema, rawData)
      const { status } = await fetch('https://api.github.com', {
        headers: {
          Authorization: `Bearer ${data.authToken}`,
        },
      })
      if (status === 401) {
        setGhTokenError({ message: 'Invalid token' })
        return
      }
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
          <div className="divide-y divide-rosePineDawn-iris">
            <div>
              <Field
                name="authToken"
                label="Access Token"
                defaultValue={defaultValues?.authToken}
                serverError={ghTokenError}
              />
              <article className="mb-3 rounded bg-rosePineDawn-overlay px-4 py-2 text-sm">
                <header className="flex items-center space-x-1 font-bold">
                  <StarIcon className="h-4 w-4" />
                  <h3>Hint</h3>
                </header>

                <p>
                  <a
                    href="https://github.com/settings/tokens/new?description=Coral&scopes=repo"
                    className="text-rosePineDawn-iris underline"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    This link
                  </a>
                  &nbsp;
                  <span>can be used as a shortcut to create your token.</span>
                </p>
              </article>
            </div>
            <div>
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
            </div>
          </div>
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
