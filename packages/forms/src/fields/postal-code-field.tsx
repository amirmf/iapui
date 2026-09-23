import type { FieldPath, FieldValues } from 'react-hook-form'

import { TextField, type TextFieldProps } from './text-field'

export type PostalCodeFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextFieldProps<TFieldValues, TName>,
  'autoComplete' | 'maxLength' | 'numerical'
>

export function PostalCodeField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: PostalCodeFieldProps<TFieldValues, TName>) {
  return (
    <TextField autoComplete='postal-code' maxLength={10} numerical {...props} />
  )
}
