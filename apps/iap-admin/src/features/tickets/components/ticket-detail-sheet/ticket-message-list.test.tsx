// @vitest-environment jsdom
import { TicketMessageList } from '@features/tickets/components/ticket-detail-sheet/ticket-message-list'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('TicketMessageList', () => {
  it('announces its loading state and replaces it with the empty state', () => {
    const { rerender } = render(
      <TicketMessageList isError={false} isLoading messages={[]} />
    )

    expect(screen.getByRole('status').textContent).toContain(
      'tickets.messages.loading'
    )

    rerender(
      <TicketMessageList isError={false} isLoading={false} messages={[]} />
    )

    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByText('tickets.messages.empty')).not.toBeNull()
  })
})
