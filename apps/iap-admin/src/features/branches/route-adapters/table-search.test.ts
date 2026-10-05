import { describe, expect, it } from 'vitest'

import {
  parseBranchTableSearch,
  toBranchApiFilters,
  toBranchTableSearch,
} from './table-search'

describe('toBranchApiFilters', () => {
  it('preserves the reference filters and serializes the selected server sort', () => {
    expect(
      toBranchApiFilters({ code: '120', unitName: 'مرکز' }, [
        { desc: true, id: 'code' },
      ])
    ).toEqual({
      code: '120',
      direction: 'desc',
      sort: 'code',
      unitName: 'مرکز',
    })
  })

  it('does not add a default sort when the user clears sorting', () => {
    expect(toBranchApiFilters({ code: '120' }, [])).toEqual({ code: '120' })
  })

  it('uses the reference URL keys and default page size', () => {
    expect(parseBranchTableSearch({ code: '120' })).toEqual({
      filters: { code: '120' },
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })

    expect(
      toBranchTableSearch({
        filters: { unitName: 'مرکز' },
        pagination: { pageIndex: 2, pageSize: 100 },
        sorting: [{ desc: true, id: 'code' }],
      })
    ).toEqual({
      direction: 'desc',
      page: '3',
      size: '100',
      sort: 'code',
      unitName: 'مرکز',
    })
  })
})
