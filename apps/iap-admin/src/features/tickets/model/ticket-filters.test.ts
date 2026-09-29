import { describe, expect, it } from 'vitest'

import { toTicketApiFilters } from './ticket-filters'

describe('ticket filters', () => {
  it('matches the reference default ticket status and sorting', () => {
    expect(toTicketApiFilters({}, [])).toEqual({
      direction: 'asc',
      sort: 'updatedAt',
      status: 'ASSIGNED',
    })
  })

  it('removes ALL instead of serializing an undefined status parameter', () => {
    expect(toTicketApiFilters({ status: 'ALL' }, [])).toEqual({
      direction: 'asc',
      sort: 'updatedAt',
    })
  })
})
