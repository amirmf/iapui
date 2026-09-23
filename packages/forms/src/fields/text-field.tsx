import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Input } from '@iap/ui'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/form'

export type TextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<ComponentPropsWithoutRef<typeof Input>, 'name' | 'value'> & {
  control: Control<TFieldValues>
  description?: ReactNode
  label: ReactNode
  name: TName
}

export function TextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: TextFieldProps<TFieldValues, TName>) {
  const { control, description, label, name, ...inputProps } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} />
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
