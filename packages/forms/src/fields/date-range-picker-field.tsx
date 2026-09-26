import type { ReactNode } from 'react'

import { DateRangePicker, type DateRangePickerProps, cn } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  useFormField,
} from '../components/form'

export type DateRangePickerFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<DateRangePickerProps, 'onBlur' | 'onChange' | 'ref' | 'value'> & {
  control: Control<TFieldValues>
  description?: ReactNode
  label: ReactNode
  name: TName
  required?: boolean
}

function DateRangePickerFieldControl(props: {
  field: {
    name: string
    onBlur: () => void
    onChange: (value: unknown) => void
    ref: (element: HTMLButtonElement | null) => void
    value: unknown
  }
  label: ReactNode
  required?: boolean
  pickerProps: Omit<
    DateRangePickerProps,
    'onBlur' | 'onChange' | 'ref' | 'value'
  >
}) {
  const { field, label, pickerProps, required } = props
  const { error, formDescriptionId, formItemId, formMessageId, name } =
    useFormField()

  return (
    <>
      <span
        className={cn(
          error && 'text-destructive',
          required &&
            "inline-flex items-center gap-1 after:text-red-600 after:content-['*']",
          'text-sm font-medium'
        )}
        id={`${formItemId}-label`}
      >
        {label}
      </span>
      <DateRangePicker
        {...pickerProps}
        aria-describedby={
          error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
        }
        aria-invalid={Boolean(error)}
        aria-labelledby={`${formItemId}-label`}
        data-form-field={name}
        id={formItemId}
        onBlur={field.onBlur}
        onChange={field.onChange}
        ref={field.ref}
        value={(field.value ?? {}) as DateRangePickerProps['value']}
      />
    </>
  )
}

export function DateRangePickerField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: DateRangePickerFieldProps<TFieldValues, TName>) {
  const { control, description, label, name, required, ...pickerProps } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <DateRangePickerFieldControl
            field={field}
            label={label}
            pickerProps={pickerProps}
            required={required}
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
