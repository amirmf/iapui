import type { FormType } from '@formio/react'

export const createDefaultFormSchema = (): FormType => ({
  components: [],
  display: 'form',
})

const isFormSchema = (value: unknown): value is FormType => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as { components?: unknown }
  return Array.isArray(candidate.components)
}

export const cloneFormSchema = (schema: FormType): FormType =>
  JSON.parse(JSON.stringify(schema)) as FormType

export const parseDocTypeFormSchema = (value?: string | null): FormType => {
  if (!value) {
    return createDefaultFormSchema()
  }

  try {
    const parsed = JSON.parse(value)
    if (isFormSchema(parsed)) {
      return cloneFormSchema(parsed)
    }
  } catch {
    // Invalid persisted schemas fall back to the empty Form.io form.
  }

  return createDefaultFormSchema()
}
