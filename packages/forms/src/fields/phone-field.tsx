import type { FieldPath, FieldValues } from 'react-hook-form'

import { TextField, type TextFieldProps } from './text-field'

export type PhoneFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<TextFieldProps<TFieldValues, TName>, 'inputMode' | 'numerical'>

export function PhoneField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: PhoneFieldProps<TFieldValues, TName>) {
  return <TextField autoComplete='tel' inputMode='tel' numerical {...props} />
}
