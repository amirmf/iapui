import type { FieldErrors, FieldValues } from 'react-hook-form'

function findFirstErrorPath(
  errors: FieldErrors<FieldValues>,
  path = ''
): string | undefined {
  for (const [key, value] of Object.entries(errors)) {
    const nextPath = path ? `${path}.${key}` : key

    if (value && typeof value === 'object' && 'type' in value) {
      return nextPath
    }

    if (value && typeof value === 'object') {
      const nestedPath = findFirstErrorPath(
        value as FieldErrors<FieldValues>,
        nextPath
      )
      if (nestedPath) {
        return nestedPath
      }
    }
  }
}

export function focusFirstError(
  errors: FieldErrors<FieldValues>,
  fields: Record<string, { focus?: () => void } | undefined>
) {
  const path = findFirstErrorPath(errors)
  fields[path ?? '']?.focus?.()
}
