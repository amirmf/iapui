import { describe, expect, it } from 'vitest'

import {
  parseBankAccountTableSearch,
  toBankAccountApiFilters,
  toBankAccountTableSearch,
} from './table-search'

describe('bank account table state', () => {
  it('preserves the reference URL contract and page-size default', () => {
    expect(parseBankAccountTableSearch({ phoneNumber: '0912' })).toEqual({
      filters: { phoneNumber: '0912' },
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })

    expect(
      toBankAccountTableSearch({
        filters: { bankAccountType: ['IBAN'] },
        pagination: { pageIndex: 2, pageSize: 100 },
        sorting: [{ desc: false, id: 'bankAccountNumber' }],
      })
    ).toEqual({
      bankAccountType: ['IBAN'],
      direction: 'asc',
      page: '3',
      size: '100',
      sort: 'bankAccountNumber',
    })
  })

  it('uses createdAt descending when no explicit sort is selected', () => {
    expect(toBankAccountApiFilters({ username: '001' }, [])).toEqual({
      direction: 'desc',
      sort: 'createdAt',
      username: '001',
    })
  })
})
