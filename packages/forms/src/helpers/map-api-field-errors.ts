import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'

export type ApiFieldErrors = Record<string, readonly string[] | undefined>

export function mapApiFieldErrors<TFieldValues extends FieldValues>(
  errors: ApiFieldErrors,
  setError: UseFormSetError<TFieldValues>,
  supportedFields: readonly FieldPath<TFieldValues>[]
) {
  const supportedFieldNames = new Set<string>(supportedFields)

  for (const [field, messages] of Object.entries(errors)) {
    const message = messages?.[0]

    if (message && supportedFieldNames.has(field)) {
      setError(field as FieldPath<TFieldValues>, { message, type: 'server' })
    }
  }
}
