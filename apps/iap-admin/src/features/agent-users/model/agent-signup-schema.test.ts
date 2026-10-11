import { createAgentSignupFormSchema } from '@features/agent-users/model/agent-signup-schema'
import referenceIssues from '@features/agent-users/test/fixtures/agent-signup-validation.reference.json'
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'

const schema = createAgentSignupFormSchema(((key: string) => key) as TFunction)
const values = {
  phoneNumber: '09123456789',
  nationalCode: 'identifier',
  password: 'secret',
  confirmPassword: 'secret',
}

describe('createAgentSignupFormSchema reference validation', () => {
  it('defaults nationality and accepts a nonnumeric identifier', () => {
    expect(schema.parse(values).nationalityType).toBe('IR')
    expect(
      schema.parse({ ...values, nationalityType: 'FOREIGN' }).nationalCode
    ).toBe('identifier')
  })

  it.each([
    ['phoneNumber', 'invalid', 'phoneNumber'],
    ['nationalCode', ' ', 'nationalCodeRequired'],
    ['password', 'short', 'passwordMinLength'],
    ['password', 'a'.repeat(256), 'passwordMaxLength'],
    ['password', ' '.repeat(6), 'passwordRequired'],
    ['confirmPassword', '', 'confirmPasswordRequired'],
    ['confirmPassword', 'different', 'passwordsMatch'],
  ])('preserves translated error for %s', (field, value, key) => {
    const result = schema.safeParse({ ...values, [field]: value })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: [field],
          message: `agent.users.validation.${key}`,
        })
      )
    }
  })
})

// Full arrays captured by executing the inspected reference schema, including
// simultaneous failures and the source superRefine ordering.
describe('source validation issue snapshots', () => {
  it.each(referenceIssues)(
    'matches exact issues for $input',
    ({ input, issues }) => {
      const result = schema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) expect(result.error.issues).toEqual(issues)
    }
  )
})
