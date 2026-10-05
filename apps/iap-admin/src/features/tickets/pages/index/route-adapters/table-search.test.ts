import { describe, expect, it } from 'vitest'

import { parseTicketTableSearch, toTicketTableSearch } from './table-search'

describe('ticket table URL state', () => {
  it('matches the reference ticket pagination and sorting URL contract', () => {
    const state = parseTicketTableSearch({
      direction: 'desc',
      features: 'tickets',
      page: '3',
      priority: 'HIGH',
      size: '50',
      sort: 'lastMessageAt',
    })

    expect(state).toEqual({
      filters: { features: 'tickets', priority: 'HIGH' },
      pagination: { pageIndex: 2, pageSize: 50 },
      sorting: [{ desc: true, id: 'lastMessageAt' }],
    })
    expect(toTicketTableSearch(state)).toEqual({
      direction: 'desc',
      features: 'tickets',
      page: '3',
      priority: 'HIGH',
      size: '50',
      sort: 'lastMessageAt',
    })
  })

  it('uses the reference defaults for malformed table controls', () => {
    expect(parseTicketTableSearch({ page: '-1', size: 'many' })).toEqual({
      filters: {},
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })
  })
})
