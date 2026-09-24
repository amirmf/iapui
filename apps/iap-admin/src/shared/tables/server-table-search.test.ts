import { describe, expect, it } from 'vitest'

import {
  parseServerTableSearch,
  toServerTableSearch,
} from './server-table-search'
import { toServerTableParams } from './server-table-state'

describe('server table state', () => {
  it('keeps feature filters separate from pagination and sorting search keys', () => {
    const state = parseServerTableSearch({
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
    expect(toServerTableSearch(state)).toMatchObject({
      page: '3',
      pageSize: '50',
    })
  })

  it('uses safe defaults for malformed values', () => {
    expect(
      parseServerTableSearch({ page: '-1', pageSize: 'many' })
    ).toMatchObject({
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [],
    })
  })
})
