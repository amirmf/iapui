import type { FieldPath, FieldValues } from 'react-hook-form'

import { TextField, type TextFieldProps } from './text-field'

export type NationalCodeFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<TextFieldProps<TFieldValues, TName>, 'maxLength' | 'numerical'>

export function NationalCodeField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: NationalCodeFieldProps<TFieldValues, TName>) {
  return <TextField maxLength={10} numerical {...props} />
}
