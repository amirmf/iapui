// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { TicketsContent } from './tickets-content'

const state = vi.hoisted(() => ({
  search: { features: 'tickets', priority: 'HIGH' } as Record<string, string>,
  navigate: vi.fn(),
  table: vi.fn(),
  query: vi.fn(),
}))
vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ search: state.search }),
  useRouter: () => ({ navigate: state.navigate }),
}))
vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: unknown) => {
    state.query(options)
    return { data: { content: [] }, refetch: vi.fn() }
  },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@shared/tables', () => ({
  PaginatedDataTable: (props: unknown) => {
    state.table(props)
    return null
  },
}))
vi.mock('@features/tickets/components/ticket-columns', () => ({
  useTicketColumns: () => [],
}))
vi.mock('@features/tickets/components/ticket-detail-sheet', () => ({
  TicketDetailSheet: () => null,
}))
vi.mock('@features/tickets/components/tickets-data-table-toolbar', () => ({
  TicketsDataTableToolbar: () => null,
}))
vi.mock('@features/tickets/services/ticket-service', () => ({
  ticketService: {},
}))
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

it('keeps source UI sorting empty while defaulting API sorting, and writes only pagination controls', () => {
  render(<TicketsContent />)
  const table = state.table.mock.lastCall![0]
  expect(table.presentation).toBe('reference')
  expect(table.sorting).toEqual([])
  expect(state.query.mock.lastCall![0].queryKey[2]).toEqual({
    priority: 'HIGH',
    status: 'ASSIGNED',
    sort: 'updatedAt',
    direction: 'asc',
  })
  table.onPaginationChange({ pageIndex: 1, pageSize: 40 })
  expect(state.navigate.mock.lastCall![0].search(state.search)).toEqual({
    ...state.search,
    page: '2',
    size: '40',
  })
})

it('writes only sorting controls and preserves current page', () => {
  render(<TicketsContent />)
  state.table.mock.lastCall![0].onSortingChange([
    { id: 'ticketNumber', desc: true },
  ])
  expect(
    state.navigate.mock.lastCall![0].search({ ...state.search, page: '3' })
  ).toEqual({
    ...state.search,
    page: '3',
    sort: 'ticketNumber',
    direction: 'desc',
  })
})
