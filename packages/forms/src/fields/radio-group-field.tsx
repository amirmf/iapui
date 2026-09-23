import type { ReactNode } from 'react'

import { RadioGroup, RadioGroupItem, cn } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from '../components/form'

export type RadioGroupOption = {
  description?: ReactNode
  label: ReactNode
  value: string
}

export type RadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  description?: ReactNode
  label: ReactNode
  name: TName
  options: readonly RadioGroupOption[]
}

function RadioGroupFieldControl(props: {
  field: {
    name: string
    onBlur: () => void
    onChange: (value: string) => void
    ref: (element: HTMLButtonElement | null) => void
    value: string
  }
  label: ReactNode
  options: readonly RadioGroupOption[]
}) {
  const { field, label, options } = props
  const { error, formDescriptionId, formItemId, formMessageId, name } =
    useFormField()
  const labelId = `${formItemId}-label`

  return (
    <>
      <span
        className={cn(error && 'text-destructive', 'text-sm font-medium')}
        id={labelId}
      >
        {label}
      </span>
      <RadioGroup
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
        }
        aria-invalid={Boolean(error)}
        aria-labelledby={labelId}
        data-form-field={name}
        id={formItemId}
        name={field.name}
        onBlur={field.onBlur}
        onValueChange={field.onChange}
        value={field.value ?? ''}
      >
        {options.map((option) => {
          const optionId = `${formItemId}-${option.value}`

          return (
            <label
              className='flex min-h-11 items-center gap-3'
              htmlFor={optionId}
              key={option.value}
            >
              <RadioGroupItem
                id={optionId}
                ref={field.ref}
                value={option.value}
              />
              <span className='grid gap-0.5'>
                <span>{option.label}</span>
                {option.description ? (
                  <span className='text-muted-foreground text-sm'>
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          )
        })}
      </RadioGroup>
    </>
  )
}

export function RadioGroupField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: RadioGroupFieldProps<TFieldValues, TName>) {
  const { control, description, label, name, options } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <RadioGroupFieldControl
            field={field}
            label={label}
            options={options}
          />
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
