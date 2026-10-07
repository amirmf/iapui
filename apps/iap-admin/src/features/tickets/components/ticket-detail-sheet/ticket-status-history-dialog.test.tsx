// @vitest-environment jsdom
import { TicketStatusHistoryDialog } from '@features/tickets/components/ticket-detail-sheet/ticket-status-history-dialog'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'fa' } }),
}))
afterEach(cleanup)
it('shows the source dash timestamp for history entries without changedAt', () => {
  render(
    <TicketStatusHistoryDialog
      statusHistory={[{ toStatus: 'CLOSED', changedAt: null }]}
    >
      <button>History</button>
    </TicketStatusHistoryDialog>
  )
  fireEvent.click(screen.getByText('History'))
  expect(screen.getByRole('dialog').querySelector('time')?.textContent).toBe(
    '-'
  )
})
