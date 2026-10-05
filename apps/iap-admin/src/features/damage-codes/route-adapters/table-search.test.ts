import { describe, expect, it } from 'vitest'

import {
  parseDamageCodeTableSearch,
  toDamageCodeApiFilters,
  toDamageCodeTableSearch,
} from './table-search'

describe('damage-code table state', () => {
  it('keeps reference URL defaults and maps date ranges to API keys', () => {
    const state = parseDamageCodeTableSearch({
      code: 'D-1',
      page: '2',
      size: '20',
      status: 'ACTIVE',
      thruDateFrom: '2026-01-01',
      thruDateTo: '2026-01-31',
    })

    expect(state.pagination).toEqual({ pageIndex: 1, pageSize: 20 })
    expect(toDamageCodeApiFilters(state.filters, [])).toMatchObject({
      code: 'D-1',
      status: 'ACTIVE',
      thruDate__from: '2026-01-01',
      thruDate__to: '2026-01-31',
    })
    expect(toDamageCodeTableSearch(state)).toMatchObject({
      code: 'D-1',
      page: '2',
      size: '20',
    })
  })
})
