// @vitest-environment jsdom
import { TicketStatusFilter } from '@features/tickets/components/ticket-status-filter'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const router = vi.hoisted(() => ({ navigate: vi.fn() }))
const location = vi.hoisted(() => ({
  search: {
    features: 'tickets',
    page: '3',
    priority: 'HIGH',
    size: '40',
    status: 'ASSIGNED',
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => location,
  useRouter: () => router,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(() => {
  cleanup()
  router.navigate.mockClear()
})

describe('TicketStatusFilter', () => {
  it('resets the reference page search and preserves ticket context on a status switch', () => {
    render(<TicketStatusFilter count={12} />)

    fireEvent.click(
      screen.getByRole('button', { name: /tickets.status.CLOSED/ })
    )

    const navigation = router.navigate.mock.calls[0]?.[0]

    expect(navigation).toMatchObject({ replace: true, to: './' })
    expect(navigation?.search(location.search)).toEqual({
      features: 'tickets',
      page: undefined,
      priority: 'HIGH',
      size: '40',
      status: 'CLOSED',
    })
  })

  it('exposes the reference status subset with an operable selected state', () => {
    render(<TicketStatusFilter count={12} />)

    expect(screen.getAllByRole('button')).toHaveLength(5)
    expect(
      screen
        .getByRole('button', { name: /tickets.status.ASSIGNED/ })
        .getAttribute('aria-pressed')
    ).toBe('true')
    expect(
      screen.queryByRole('button', { name: /tickets.status.OPEN/ })
    ).toBeNull()
  })

  it('navigates relative to the active tickets route', () => {
    render(<TicketStatusFilter count={12} />)

    fireEvent.click(
      screen.getByRole('button', { name: /tickets.status.CLOSED/ })
    )

    const navigation = router.navigate.mock.calls[0]?.[0]

    expect(navigation).toMatchObject({ replace: true, to: './' })
    expect(navigation?.search(location.search)).toEqual({
      features: 'tickets',
      page: undefined,
      priority: 'HIGH',
      size: '40',
      status: 'CLOSED',
    })
  })
})
