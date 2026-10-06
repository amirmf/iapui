import { describe, expect, it } from 'vitest'

import { assignementRuleFormSchema } from './assignement-rule-form-schema'

describe('assignementRuleFormSchema', () => {
  const mockT = ((key: string) => key) as never
  const schema = assignementRuleFormSchema(mockT)

  it('fails validation when title is empty', () => {
    const result = schema.safeParse({
      status: 'ACTIVE',
      title: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'assignementRules.errors.titleRequired'
      )
    }
  })

  it('passes validation with minimal valid input', () => {
    const result = schema.safeParse({
      status: 'ACTIVE',
      title: 'Valid Rule',
    })
    expect(result.success).toBe(true)
  })

  it('passes validation with all numeric form fields as strings', () => {
    const result = schema.safeParse({
      amountApprovedMax: '500',
      amountApprovedMin: '100',
      amountMax: '1000',
      amountMin: '50',
      docTypeCode: 'SURG',
      extContractId: '12',
      extPolicyId: '34',
      extWorkUnitCode: '56',
      fromDate: new Date('2026-01-01'),
      mainAssignedUserUsername: 'doctor_a',
      status: 'INACTIVE',
      thruDate: new Date('2026-12-31'),
      title: 'Full Rule',
    })
    expect(result.success).toBe(true)
  })
})
