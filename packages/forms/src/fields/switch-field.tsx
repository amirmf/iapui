import type { ReactNode } from 'react'

import { Switch, cn } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from '../components/form'

export type SwitchFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  description?: ReactNode
  label: ReactNode
  name: TName
  required?: boolean
}

function SwitchFieldControl(props: {
  field: {
    name: string
    onBlur: () => void
    onChange: (value: boolean) => void
    ref: (element: HTMLButtonElement | null) => void
    value: boolean
  }
  label: ReactNode
  required?: boolean
}) {
  const { field, label, required } = props
  const { error, formDescriptionId, formItemId, formMessageId, name } =
    useFormField()
  const labelId = `${formItemId}-label`

  return (
    <div className='flex min-h-11 items-center justify-between gap-3'>
      <span
        className={cn(
          error && 'text-destructive',
          required &&
            "inline-flex items-center gap-1 after:text-red-600 after:content-['*']",
          'text-sm font-medium'
        )}
        id={labelId}
      >
        {label}
      </span>
      <Switch
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
        }
        aria-invalid={Boolean(error)}
        aria-labelledby={labelId}
        checked={field.value}
        data-form-field={name}
        id={formItemId}
        name={field.name}
        onBlur={field.onBlur}
        onCheckedChange={field.onChange}
        ref={field.ref}
      />
    </div>
  )
}

export function SwitchField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: SwitchFieldProps<TFieldValues, TName>) {
  const { control, description, label, name, required } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <SwitchFieldControl field={field} label={label} required={required} />
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
