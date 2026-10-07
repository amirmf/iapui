// @vitest-environment jsdom
import { ClaimRequestBulkStatusChangeDialog } from '@features/claim-requests/components/claim-request-bulk-status-change-dialog'
import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  t: (key: string) => key,
  submitObjectionsBulk: vi.fn(),
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: mocks.t }) }))
vi.mock('@features/claim-requests/services/claim-request-service', () => ({
  claimRequestService: mocks,
}))
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => {
  vi.unstubAllGlobals()
  cleanup()
  useClaimRequestStore.getState().reset()
})
it('renders the source searchable scalar control with its placeholder', () => {
  useClaimRequestStore.getState().setOpenDialog('bulkStatusChange')
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ClaimRequestBulkStatusChangeDialog
        claimRequestIds={['claim-1']}
        onSuccess={vi.fn()}
      />
    </QueryClientProvider>
  )
  fireEvent.click(screen.getByRole('combobox'))
  expect(
    screen.getByPlaceholderText(
      'claimRequests.bulkStatusChange.statusPlaceholder'
    )
  ).toBeTruthy()
  expect(screen.getAllByRole('combobox')).toHaveLength(2)
})
