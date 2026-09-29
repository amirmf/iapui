// @vitest-environment jsdom
import type { ComponentProps, PropsWithChildren } from 'react'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ClaimRequestTicketsPage } from './claim-request-tickets-page'

const router = vi.hoisted(() => ({
  navigate: vi.fn(),
  state: {
    location: {
      search: {
        features: 'tickets',
        page: '3',
        priority: 'HIGH',
        quickStatus: 'tickets',
        size: '40',
        status: 'ASSIGNED',
      },
    },
  },
}))

vi.mock('@features/claim-requests', () => ({
  CLAIM_REQUEST_FEATURE_QUERY_KEY: 'features',
  CLAIM_REQUEST_FEATURES: {
    claimRequests: 'claimRequests',
    tickets: 'tickets',
  },
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS: 'tickets',
  ClaimRequestQuickStatusFilter: ({
    onQuickStatusChange,
  }: {
    onQuickStatusChange?: (status: 'DELEGATED') => void
  }) => (
    <button onClick={() => onQuickStatusChange?.('DELEGATED')} type='button'>
      switch-to-delegated
    </button>
  ),
}))

vi.mock('@iap/ui', () => ({
  Button: ({ children, ...props }: ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@shared/tables', () => ({
  PaginatedDataTable: () => <div />,
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { content: [], totalElements: 0, totalPages: 0 },
    isError: false,
    isFetching: false,
    isLoading: false,
    refetch: vi.fn(),
  }),
}))

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => router,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('../services/ticket-service', () => ({
  ticketService: { findPage: vi.fn() },
}))

vi.mock('./ticket-columns', () => ({
  useTicketColumns: () => [],
}))

vi.mock('./ticket-detail-sheet', () => ({
  TicketDetailSheet: () => null,
}))

vi.mock('./ticket-provider', () => ({
  TicketProvider: ({ children }: PropsWithChildren) => <>{children}</>,
}))

vi.mock('./ticket-toolbar', () => ({
  TicketToolbar: () => null,
}))

afterEach(() => {
  cleanup()
  router.navigate.mockClear()
})

describe('ClaimRequestTicketsPage', () => {
  it('switches back to the reference claim-request feature without retaining ticket table filters', () => {
    render(<ClaimRequestTicketsPage />)

    fireEvent.click(screen.getByRole('button', { name: 'switch-to-delegated' }))

    expect(router.navigate).toHaveBeenCalledWith({
      replace: true,
      search: {
        features: 'claimRequests',
        quickStatus: 'DELEGATED',
      },
      to: '/claim-requests/',
    })
  })
})
