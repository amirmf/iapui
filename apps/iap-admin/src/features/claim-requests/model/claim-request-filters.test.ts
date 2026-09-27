import { describe, expect, it } from 'vitest'

import {
  getClaimRequestQuickStatus,
  toClaimRequestApiFilters,
} from './claim-request-filters'

describe('claim request filters', () => {
  it('uses the reference page default quick status', () => {
    expect(getClaimRequestQuickStatus({})).toBe('IN_ASSESSMENT')
  })

  it('keeps helper-produced API keys and adds the selected quick status', () => {
    expect(
      toClaimRequestApiFilters({
        amount__fromNum: '100',
        createdAt__to: '2026-01-31',
        extDisplayName__like: 'رضا',
        extNationalCode: '1234567890',
        quickStatus: 'PAID',
      })
    ).toEqual({
      amount__fromNum: '100',
      createdAt__to: '2026-01-31',
      extDisplayName__like: 'رضا',
      extNationalCode: '1234567890',
      sort: 'createdAt',
      direction: 'asc',
      status: 'PAID',
    })
  })

  it('applies a selected quick status as the API status filter', () => {
    expect(toClaimRequestApiFilters({ quickStatus: 'PAID' })).toEqual({
      direction: 'asc',
      sort: 'createdAt',
      status: 'PAID',
    })
  })

  it('uses the doctor-specific default status', () => {
    expect(getClaimRequestQuickStatus({}, true)).toBe('DELEGATED')
  })
})
