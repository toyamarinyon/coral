import { Field } from '../../components'
import { Config, configSchema } from '../../config'
import { StarIcon } from '@heroicons/react/24/solid'
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
    async (event) => {
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
          <div className="divide-y divide-rosePineDawn-iris">
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
              <div>
                <Field
                  name="extraQuery"
                  label="Extra Query"
                  defaultValue={defaultValues?.extraQuery}
                  optional={true}
                />
                <article className="mb-3 rounded bg-rosePineDawn-overlay px-4 py-2 text-sm">
                  <header className="flex items-center space-x-1 font-bold">
                    <StarIcon className="h-4 w-4" />
                    <h3>Hint</h3>
                  </header>

                  <div className="space-y-1">
                    <p>
                      You can use the GitHub Code Search syntax like label,
                      assignee, and others. If you want to know the GitHub Code
                      Search sysntax to read the{' '}
                      <a
                        href="https://docs.github.com/en/search-github/github-code-search/understanding-github-code-search-syntax"
                        className="text-rosePineDawn-iris underline"
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        documentation
                      </a>
                      .
                    </p>
                    {/* @todo live preview
                      <p>
                      If you want to check the results with the current query to{' '}
                      <a
                        href="https://github.com/search?q=repo%3Aroute06%2Fdor%20hello&type=code"
                        className="text-rosePineDawn-iris underline"
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        check on the GitHub
                      </a>
                      .
                    </p> */}
                  </div>
                </article>
              </div>
            </div>
          </div>
          <Form.Submit asChild>
            <button className="mt-[10px] box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-rosePineDawn-text px-[15px] font-medium leading-none text-rosePineDawn-base focus:outline-none disabled:cursor-not-allowed disabled:bg-rosePineDawn-muted">
              Save
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </main>
  )
}
