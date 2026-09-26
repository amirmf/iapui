import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Textarea } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/form'

export type TextareaFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<ComponentPropsWithoutRef<typeof Textarea>, 'name' | 'value'> & {
  control: Control<TFieldValues>
  description?: ReactNode
  label: ReactNode
  name: TName
}

export function TextareaField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: TextareaFieldProps<TFieldValues, TName>) {
  const { control, description, label, name, required, ...textareaProps } =
    props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} {...textareaProps} required={required} />
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
