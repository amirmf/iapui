import type { FormType, Submission } from '@formio/react'

export const emptyForm: FormType = { components: [], display: 'form' }

export function cloneSubmission(value: Submission['data']): Submission['data'] {
  return JSON.parse(JSON.stringify(value ?? {})) as Submission['data']
}

export function parseFormSchema(value: unknown): FormType | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    try {
      return parseFormSchema(JSON.parse(value))
    } catch {
      return null
    }
  }
  return value &&
    typeof value === 'object' &&
    Array.isArray((value as FormType).components)
    ? (value as FormType)
    : null
}

export function parseSubmission(value: unknown): Submission['data'] {
  if (typeof value === 'string') {
    try {
      return parseSubmission(JSON.parse(value))
    } catch {
      return {}
    }
  }
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Submission['data'])
    : {}
}
