import * as Form from '@radix-ui/react-form'
import { InputHTMLAttributes, LabelHTMLAttributes, forwardRef } from 'react'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>
export const Input: React.FC<InputProps> = forwardRef<
  HTMLInputElement,
  InputProps
>((props, ref) => (
  <input
    className="bg-blackA2 shadow-blackA6 selection:color-white selection:bg-blackA6 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none  hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
    {...props}
    ref={ref}
  />
))

type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'className'>
export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label className="text-[15px] font-medium leading-[35px]" {...props}>
    {children}
  </label>
)

export type ServerError = {
  message: string
}
type FieldProps = Pick<InputProps, 'type'> & {
  name: string
  label: string
  optional?: boolean
  message?: string
  defaultValue?: string
  serverError?: ServerError | null
}
export const Field: React.FC<FieldProps> = (
  { name, type = 'text', label, optional = false, defaultValue, serverError },
  ref,
) => (
  <Form.Field
    className="mb-[10px]"
    name={name}
    ref={ref}
    serverInvalid={serverError != null}
  >
    <div className="flex items-baseline justify-between">
      <Form.Label asChild>
        <Label>{label}</Label>
      </Form.Label>
    </div>
    <Form.Control asChild defaultValue={defaultValue}>
      <Input type={type} required={!optional} />
    </Form.Control>
    <Form.Message className="text-[13px] opacity-[0.8]" match="valueMissing">
      Please enter {label}
    </Form.Message>
    {serverError && (
      <Form.Message className="text-[13px] opacity-[0.8]">
        {serverError?.message}
      </Form.Message>
    )}
  </Form.Field>
)
