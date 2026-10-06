import { describe, expect, it } from 'vitest'

import {
  parseOutpatientDocAcceptanceTableSearch,
  toOutpatientDocAcceptanceTableSearch,
} from './table-search'

describe('Outpatient document acceptances table URL state', () => {
  it('round-trips the reference pagination, sorting, and filters', () => {
    const state = parseOutpatientDocAcceptanceTableSearch({
      page: '2',
      size: '40',
      sort: 'exId',
      direction: 'desc',
      status: ['SUCCESS'],
      policyId: 'POL-1',
    })

    expect(state).toMatchObject({
      filters: {
        direction: 'desc',
        sort: 'exId',
        status: ['SUCCESS'],
        policyId: 'POL-1',
      },
      pagination: { pageIndex: 1, pageSize: 40 },
      sorting: [{ desc: true, id: 'exId' }],
    })
    expect(toOutpatientDocAcceptanceTableSearch(state)).toEqual({
      page: '2',
      size: '40',
      sort: 'exId',
      direction: 'desc',
      status: ['SUCCESS'],
      policyId: 'POL-1',
    })
  })

  it('falls back to the reference page size and first page', () => {
    expect(
      parseOutpatientDocAcceptanceTableSearch({ page: '0', size: '-1' })
        .pagination
    ).toEqual({ pageIndex: 0, pageSize: 40 })
  })
})
