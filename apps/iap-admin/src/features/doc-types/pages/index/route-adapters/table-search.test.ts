import { describe, expect, it } from 'vitest'

import {
  parseDocTypeTableSearch,
  toDocTypeApiFilters,
  toDocTypeTableSearch,
} from './table-search'

describe('document-type table URL state', () => {
  it('matches the reference pagination and sorting URL contract', () => {
    const state = parseDocTypeTableSearch({
      direction: 'desc',
      docType: 'Invoice',
      page: '3',
      size: '50',
      sort: 'docType',
    })

    expect(state).toEqual({
      filters: { docType: 'Invoice' },
      pagination: { pageIndex: 2, pageSize: 50 },
      sorting: [{ desc: true, id: 'docType' }],
    })
    expect(toDocTypeTableSearch(state)).toEqual({
      direction: 'desc',
      docType: 'Invoice',
      page: '3',
      size: '50',
      sort: 'docType',
    })
  })

  it('uses the reference defaults and sends sorting as API filters', () => {
    expect(parseDocTypeTableSearch({ page: '-1', size: 'many' })).toEqual({
      filters: {},
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })
    expect(
      toDocTypeApiFilters({ docType: 'Invoice' }, [
        { desc: false, id: 'sequence' },
      ])
    ).toEqual({
      direction: 'asc',
      docType: 'Invoice',
      sort: 'sequence',
    })
  })
})
