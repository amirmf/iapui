import {
  parseMedicalCenterInvoiceTableSearch,
  toMedicalCenterInvoiceListRequest,
  toMedicalCenterInvoiceTableSearch,
} from '@features/medical-center/route-adapters/table-search'
import { describe, expect, it } from 'vitest'

describe('Medical Center reference table contract', () => {
  it('defaults to one-based page 1 and 40 rows', () => {
    const state = parseMedicalCenterInvoiceTableSearch({})
    expect(state).toEqual({
      filters: {},
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })
  })
  it('round trips lowercase URL sorting and converts API direction to uppercase', () => {
    const state = parseMedicalCenterInvoiceTableSearch({
      page: '3',
      size: '80',
      sort: 'createdAt',
      direction: 'desc',
      documentNumber: '42',
      state: 'CREATED',
      custom: 'retained',
      ignored: ['a'],
    })
    expect(toMedicalCenterInvoiceTableSearch(state)).toEqual({
      page: '3',
      size: '80',
      sort: 'createdAt',
      direction: 'desc',
      documentNumber: '42',
      state: 'CREATED',
      custom: 'retained',
      ignored: ['a'],
    })
    expect(toMedicalCenterInvoiceListRequest(state)).toEqual({
      page: 2,
      size: 80,
      sort: 'createdAt',
      direction: 'DESC',
      filters: { documentNumber: '42', state: 'CREATED', custom: 'retained' },
    })
  })
  it('rejects malformed numeric and uppercase URL sort state like source', () => {
    expect(
      parseMedicalCenterInvoiceTableSearch({
        page: 'bad',
        size: 'bad',
        sort: 'date',
        direction: 'DESC',
      })
    ).toEqual({
      filters: {},
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })
  })
})
