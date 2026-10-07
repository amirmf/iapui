// @vitest-environment jsdom
import { TicketMessage } from '@features/tickets/components/ticket-detail-sheet/ticket-message'
import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

const formatDateTime = vi.hoisted(() => vi.fn(() => 'source date'))
vi.mock('@iap/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@iap/ui')>()),
  formatDateTime,
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}))
it('formats mounted ticket messages with the source language and date semantics', () => {
  render(
    <TicketMessage
      message={{ createdAt: '2026-10-07T09:00:00', body: 'Hello' } as never}
    />
  )
  expect(formatDateTime).toHaveBeenCalledWith(
    '2026-10-07T09:00:00',
    undefined,
    {
      language: 'en',
      normalizeTimezone: false,
      invalidDate: 'throw',
    }
  )
})
