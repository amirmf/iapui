import {
  toApiFilters,
  toFilterFormValues,
} from '@features/my-claims/model/filter-values'
import { describe, expect, it } from 'vitest'

describe('MyClaimRequestsFilter source status semantics', () => {
  it('maps sent-to-bank to the unpaid PAID subset and restores that form value', () => {
    const filters = toApiFilters({
      status: ['SENT_TO_BANK'],
      extNationalCode: '0012345678',
    })
    expect(filters).toEqual({
      status: ['PAID'],
      extPaymentDate: 'null',
      extNationalCode: '0012345678',
    })
    expect(toFilterFormValues(filters)).toEqual({
      status: ['SENT_TO_BANK'],
      extNationalCode: '0012345678',
    })
  })

  it('maps paid to a non-null payment date and preserves local date boundaries', () => {
    expect(
      toApiFilters({ status: ['PAID'], submitDate__from: '2026-10-10' })
    ).toEqual({
      status: ['PAID'],
      extPaymentDate__neq: 'null',
      submitDate__from: '2026-10-10',
    })
  })

  it('drops empty status filters and stale payment-date constraints', () => {
    expect(toApiFilters({ status: [] })).toEqual({ status: undefined })
    expect(
      toFilterFormValues({ status: ['APPROVED'], extPaymentDate__neq: 'null' })
    ).toEqual({ status: ['APPROVED'] })
  })
})
