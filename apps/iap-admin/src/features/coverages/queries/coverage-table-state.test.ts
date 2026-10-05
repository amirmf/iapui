import { describe, expect, it } from 'vitest'

import {
  parseCoverageTableSearch,
  toCoverageApiFilters,
  toCoverageTableSearch,
} from './coverage-table-state'

describe('coverage table state', () => {
  it('parses page, sorting, and feature filters from the URL', () => {
    expect(
      parseCoverageTableSearch({
        code: 'A12',
        direction: 'desc',
        page: '2',
        size: '20',
        sort: 'title',
      })
    ).toEqual({
      filters: { code: 'A12' },
      pagination: { pageIndex: 1, pageSize: 20 },
      sorting: [{ desc: true, id: 'title' }],
    })
  })

  it('retains sorting in the URL without adding it to page-full filters', () => {
    const state = parseCoverageTableSearch({ code: 'A12' })
    const sorting = [{ desc: false, id: 'code' }]

    expect(toCoverageApiFilters(state.filters)).toEqual({ code: 'A12' })
    expect(toCoverageTableSearch({ ...state, sorting })).toMatchObject({
      code: 'A12',
      direction: 'asc',
      page: '1',
      size: '40',
      sort: 'code',
    })
  })
})
