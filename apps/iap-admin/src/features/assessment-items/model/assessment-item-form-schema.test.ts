import { describe, expect, it } from 'vitest'

import { assessmentItemFormSchema } from './assessment-item-form-schema'

describe('assessment form source validation', () => {
  const valid = {
    claimRequestId: 'claim',
    damageCode: { id: '00000000-0000-4000-8000-000000000001' },
    status: 'APPROVED' as const,
    amountItem: '10000',
    estimatedAmount: 10000,
    quantity: '1',
  }
  const schema = assessmentItemFormSchema((key) => key)
  it('enforces exact amount and quantity boundaries', () => {
    expect(schema.safeParse(valid).success).toBe(true)
    expect(schema.safeParse({ ...valid, amountItem: '9999' }).success).toBe(
      false
    )
    expect(schema.safeParse({ ...valid, quantity: '101' }).success).toBe(false)
    expect(schema.safeParse({ ...valid, quantity: '100' }).success).toBe(true)
  })
  it('requires floating insured person only when selected', () => {
    const result = schema.safeParse({
      ...valid,
      useFloatCoverage: true,
      overrideInsuredPersonId: null,
    })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.issues.at(-1)).toMatchObject({
        path: ['overrideInsuredPersonId'],
        message: 'assessmentItems.validation.overrideInsuredPersonId',
      })
    expect(
      schema.safeParse({
        ...valid,
        useFloatCoverage: true,
        overrideInsuredPersonId: 0,
      }).success
    ).toBe(true)
  })
})
