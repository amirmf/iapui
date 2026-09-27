import { toServerTableParams } from '@shared/tables/data-table/server-table-state'
import {
  parseTableFilterSearch,
  toTableFilterSearch,
} from '@shared/tables/filter/use-sync-query-params-table-filter'
import { describe, expect, it } from 'vitest'

describe('table filter search state', () => {
  it('keeps feature filters separate from pagination and sorting search keys', () => {
    const state = parseTableFilterSearch({
      page: '3',
      pageSize: '50',
      sort: 'createdAt',
      sortDirection: 'desc',
      status: 'pending',
    })

    expect(state).toEqual({
      filters: { status: 'pending' },
      pagination: { pageIndex: 2, pageSize: 50 },
      sorting: [{ desc: true, id: 'createdAt' }],
    })
    expect(toServerTableParams(state)).toEqual({
      page: 3,
      pageSize: 50,
      sort: 'createdAt',
      sortDirection: 'desc',
      status: 'pending',
    })
    expect(toTableFilterSearch(state)).toMatchObject({
      page: '3',
      pageSize: '50',
    })
  })

  it('uses safe defaults for malformed values', () => {
    expect(
      parseTableFilterSearch({ page: '-1', pageSize: 'many' })
    ).toMatchObject({
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [],
    })
  })
})
