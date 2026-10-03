import { describe, expect, it } from 'vitest'

import {
  parseClaimReportTableSearch,
  toClaimReportTableSearch,
} from './claim-report-table-search'

describe('Claim Reports table URL state', () => {
  it('uses the reference page, size, sort, and direction query keys', () => {
    const state = parseClaimReportTableSearch({
      page: '2',
      size: '40',
      sort: 'exId',
      direction: 'desc',
      status: ['SUCCESS'],
    })

    expect(state).toMatchObject({
      filters: {
        direction: 'desc',
        sort: 'exId',
        status: ['SUCCESS'],
      },
      pagination: { pageIndex: 1, pageSize: 40 },
      sorting: [{ desc: true, id: 'exId' }],
    })
    expect(toClaimReportTableSearch(state)).toEqual({
      page: '2',
      size: '40',
      sort: 'exId',
      direction: 'desc',
      status: ['SUCCESS'],
    })
  })

  it('applies the reference default page size', () => {
    expect(parseClaimReportTableSearch({}).pagination).toEqual({
      pageIndex: 0,
      pageSize: 40,
    })
  })
})
