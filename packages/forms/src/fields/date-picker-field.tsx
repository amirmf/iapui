import type { ReactNode } from 'react'

import { DatePicker, type DatePickerProps } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/form'

export type DatePickerFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<DatePickerProps, 'onBlur' | 'onChange' | 'ref' | 'value'> & {
  control: Control<TFieldValues>
  description?: ReactNode
  label: ReactNode
  name: TName
}

export function DatePickerField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: DatePickerFieldProps<TFieldValues, TName>) {
  const { control, description, label, name, ...datePickerProps } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DatePicker
              {...datePickerProps}
              onBlur={field.onBlur}
              onChange={field.onChange}
              ref={field.ref}
              value={field.value as Date | undefined}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
