import { TextField } from '@iap/forms'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

export function PasswordFields<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: {
  control: Control<TFieldValues>
  passwordLabel: string
  passwordName: TName
  passwordConfirmationLabel: string
  passwordConfirmationName: TName
}) {
  const {
    control,
    passwordConfirmationLabel,
    passwordConfirmationName,
    passwordLabel,
    passwordName,
  } = props

  return (
    <>
      <TextField
        autoComplete='new-password'
        control={control}
        label={passwordLabel}
        name={passwordName}
        required
        type='password'
      />
      <TextField
        autoComplete='new-password'
        control={control}
        label={passwordConfirmationLabel}
        name={passwordConfirmationName}
        required
        type='password'
      />
    </>
  )
}
