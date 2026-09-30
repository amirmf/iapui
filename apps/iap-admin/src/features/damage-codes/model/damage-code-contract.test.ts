import {
  damageCodeFormSchema,
  damageCodePageSchema,
  damageCodePricingFormSchema,
  damageCodePricingPriceRequestSchema,
  damageCodePricingSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('damage-code contracts', () => {
  it('accepts reference-compatible page items and optional metadata', () => {
    expect(
      damageCodePageSchema.parse({
        content: [
          {
            code: 'D-1',
            id: '7c8c1fb3-74e2-43e4-bdab-446f7cfeaf7d',
            status: 'ACTIVE',
            title: 'ویزیت',
          },
        ],
      }).content
    ).toHaveLength(1)
  })

  it('rejects a null status because the reference only permits omission', () => {
    expect(
      damageCodePageSchema.safeParse({
        content: [
          {
            code: 'D-1',
            id: '7c8c1fb3-74e2-43e4-bdab-446f7cfeaf7d',
            status: null,
            title: 'ویزیت',
          },
        ],
      }).success
    ).toBe(false)
  })

  it('rejects invalid form values while preserving reference fields', () => {
    expect(damageCodeFormSchema.safeParse({ status: 'ACTIVE' }).success).toBe(
      false
    )
    expect(
      damageCodePricingFormSchema.safeParse({
        amount: -1,
        damageCodeId: '7c8c1fb3-74e2-43e4-bdab-446f7cfeaf7d',
        priceType: 'TOTAL',
      }).success
    ).toBe(false)
  })

  it('uses the reference pricing response timestamp and price-request contracts', () => {
    expect(
      damageCodePricingSchema.safeParse({
        amount: 1,
        damageCodeId: '7c8c1fb3-74e2-43e4-bdab-446f7cfeaf7d',
        fromDate: 'not-a-date',
        priceType: 'TOTAL',
      }).success
    ).toBe(false)
    expect(
      damageCodePricingPriceRequestSchema.safeParse({
        damageCodeId: 'reference-allows-a-string',
        priceType: 'TOTAL',
        year: 1405,
      }).success
    ).toBe(true)
  })
})
