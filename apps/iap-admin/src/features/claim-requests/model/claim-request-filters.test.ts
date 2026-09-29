import { describe, expect, it } from 'vitest'

import {
  getClaimRequestQuickStatus,
  toClaimRequestApiFilters,
} from './claim-request-filters'

describe('claim request filters', () => {
  it('uses the reference page default quick status', () => {
    expect(getClaimRequestQuickStatus({})).toBe('IN_ASSESSMENT')
  })

  it('does not apply the current-user filter to the reference default status', () => {
    expect(toClaimRequestApiFilters({})).toEqual({
      direction: 'asc',
      sort: 'createdAt',
      status: 'IN_ASSESSMENT',
    })
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
      extPaymentDate__neq: 'null',
      status: 'PAID',
    })
  })

  it('applies a selected quick status as the API status filter', () => {
    expect(toClaimRequestApiFilters({ quickStatus: 'PAID' })).toEqual({
      direction: 'asc',
      extPaymentDate__neq: 'null',
      sort: 'createdAt',
      status: 'PAID',
    })
  })

  it('uses the reference sent-to-bank payment filter', () => {
    expect(toClaimRequestApiFilters({ quickStatus: 'SENT_TO_BANK' })).toEqual({
      direction: 'asc',
      extPaymentDate: 'null',
      sort: 'createdAt',
      status: 'PAID',
    })
  })

  it('uses the doctor-specific default status', () => {
    expect(getClaimRequestQuickStatus({}, true)).toBe('DELEGATED')
  })

  it('preserves the explicit ALL state without injecting a status filter', () => {
    expect(toClaimRequestApiFilters({ quickStatus: 'ALL' })).toEqual({
      direction: 'asc',
      skipCurrentUserFilter: 'Y',
      sort: 'createdAt',
    })
  })

  it('normalizes an unsupported doctor URL status to the reference default', () => {
    expect(getClaimRequestQuickStatus({ quickStatus: 'APPROVED' }, true)).toBe(
      'DELEGATED'
    )
    expect(toClaimRequestApiFilters({ quickStatus: 'APPROVED' }, true)).toEqual(
      {
        direction: 'asc',
        sort: 'createdAt',
        status: 'DELEGATED',
      }
    )
  })
})
