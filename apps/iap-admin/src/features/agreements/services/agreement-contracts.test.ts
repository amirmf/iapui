import {
  agreementCoverageApplFormSchema,
  agreementCoverageApplFullSchema,
  agreementCoverageApplSchema,
  agreementFormSchema,
  agreementPartyApplCreateFormSchema,
  agreementPartyApplSchema,
  agreementSchema,
  coverageSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('reference agreement contracts', () => {
  it('validates nested coverage pricing with the reference calendar-aware ISO variants', () => {
    const full = (fromDate: string) => ({
      damageCode: {
        pricing: [
          {
            damageCodeId: '550e8400-e29b-41d4-a716-446655440000',
            priceType: 'TOTAL',
            amount: 10,
            fromDate,
          },
        ],
      },
    })
    expect(
      agreementCoverageApplFullSchema.safeParse(full('2026-01-02T03:04'))
        .success
    ).toBe(true)
    expect(
      agreementCoverageApplFullSchema.safeParse(
        full('2026-01-02T03:04:05+0330')
      ).success
    ).toBe(true)
    expect(
      agreementCoverageApplFullSchema.safeParse(full('2026-02-30T03:04:05Z'))
        .success
    ).toBe(false)
    const invalidCoverage = coverageSchema.safeParse({ fromDate: 'invalid' })
    expect(invalidCoverage.success).toBe(false)
    if (!invalidCoverage.success)
      expect(invalidCoverage.error.issues[0]?.message).toBe(
        'Invalid datetime format'
      )
  })
  it('normalizes optional text and numeric text exactly as the reference form', () => {
    expect(
      agreementFormSchema().parse({
        title: 'Title',
        code: 'Code',
        status: 'ACTIVE',
        fromDate: new Date(),
        templateCode: '  ',
        extLocation: ' place ',
        extPolicyId: 42,
        extPlanId: null,
      })
    ).toMatchObject({
      templateCode: undefined,
      extLocation: 'place',
      extPolicyId: '42',
      extPlanId: undefined,
    })
    const result = agreementFormSchema((key) => `translated:${key}`).safeParse({
      title: '',
      code: '',
      status: 'ACTIVE',
      fromDate: new Date(),
    })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        'translated:agreements.validation.titleRequired',
        'translated:agreements.validation.codeRequired',
      ])
  })

  it('accepts the reference ISO variants and rejects invalid calendar dates', () => {
    expect(
      agreementSchema.safeParse({ fromDate: '2026-01-02T03:04' }).success
    ).toBe(true)
    expect(
      agreementSchema.safeParse({ fromDate: '2026-01-02T03:04:05+0330' })
        .success
    ).toBe(true)
    expect(
      agreementSchema.safeParse({ fromDate: '2026-02-30T03:04:05Z' }).success
    ).toBe(false)
  })

  it('retains party and coverage response field-specific nullability and date rules', () => {
    expect(agreementPartyApplSchema.safeParse({ id: null }).success).toBe(false)
    expect(
      agreementPartyApplSchema.parse({ createdAt: 'raw date', extra: true })
    ).toEqual({ createdAt: 'raw date' })
    expect(
      agreementCoverageApplSchema.parse({ fromDate: '2026-01-02', extra: true })
    ).toEqual({ fromDate: '2026-01-02' })
    expect(agreementSchema.parse({ extra: true })).toEqual({ extra: true })
  })

  it('accepts nullable coverage fields and unrestricted string lookup ids from the reference form', () => {
    expect(
      agreementCoverageApplFormSchema.parse({
        agreementId: 'selected',
        coverageDetailId: '',
        overrideRatio: null,
        coverageAmount: null,
        fromDate: null,
      })
    ).toEqual({
      agreementId: 'selected',
      coverageDetailId: '',
      overrideRatio: null,
      coverageAmount: null,
      fromDate: null,
    })
  })

  it('uses the translated party user validation and restricted creation roles', () => {
    const result = agreementPartyApplCreateFormSchema(
      (key) => `translated:${key}`
    ).safeParse({ userAccountId: '', role: 'HQ_USER' })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe(
        'translated:agreementPartyAppls.validation.userAccountIdRequired'
      )
  })
})
