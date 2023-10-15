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

type FieldProps = Pick<InputProps, 'type'> & {
  name: string
  label: string
  optional?: boolean
  message?: string
  defaultValue?: string
}
export const Field: React.FC<FieldProps> = ({
  name,
  type = 'text',
  label,
  optional = false,
  defaultValue,
}) => (
  <Form.Field className="mb-[10px] grid" name={name}>
    <div className="flex items-baseline justify-between">
      <Form.Label asChild>
        <Label>{label}</Label>
      </Form.Label>
      <Form.Message className="text-[13px] opacity-[0.8]" match="valueMissing">
        Please enter {label}
      </Form.Message>
    </div>
    <Form.Control asChild defaultValue={defaultValue}>
      <Input type={type} required={!optional} />
    </Form.Control>
  </Form.Field>
)
