import { CLAIM_REQUEST_FEATURES } from '@features/claim-requests'
import { toClaimRequestsSearch } from '@features/tickets/route-adapters/claim-request-navigation'
import { toTicketStatusSearch } from '@features/tickets/route-adapters/ticket-navigation'
import { describe, expect, it } from 'vitest'

describe('ticket navigation', () => {
  it('returns from tickets to the reference claim-request feature state', () => {
    expect(toClaimRequestsSearch('DELEGATED')).toEqual({
      features: CLAIM_REQUEST_FEATURES.claimRequests,
      quickStatus: 'DELEGATED',
    })
  })

  it('resets the page while preserving table filters when status changes', () => {
    expect(
      toTicketStatusSearch(
        { page: '4', priority: 'HIGH', quickStatus: 'tickets' },
        'CLOSED'
      )
    ).toEqual({
      page: undefined,
      priority: 'HIGH',
      quickStatus: 'tickets',
      status: 'CLOSED',
    })
  })

  it('keeps the ticket feature active while changing statuses, including ALL', () => {
    expect(
      toTicketStatusSearch(
        { features: 'tickets', page: '2', size: '40', status: 'ASSIGNED' },
        'ALL'
      )
    ).toEqual({
      features: 'tickets',
      page: undefined,
      size: '40',
      status: 'ALL',
    })
  })
})
