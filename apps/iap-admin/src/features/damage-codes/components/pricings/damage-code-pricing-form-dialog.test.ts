import { describe, expect, it } from 'vitest'

import { getDamageCodePricingFormDefaults } from './damage-code-pricing-form-defaults'

describe('getDamageCodePricingFormDefaults', () => {
  it('keeps create-date fields undefined as in the reference pricing table form', () => {
    expect(
      getDamageCodePricingFormDefaults({
        code: 'D-1',
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'ویزیت',
      })
    ).toMatchObject({
      amount: 0,
      damageCodeId: '550e8400-e29b-41d4-a716-446655440000',
      fromDate: undefined,
      priceType: 'TOTAL',
      thruDate: undefined,
      unit: '',
    })
  })
})
