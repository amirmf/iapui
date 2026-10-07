// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { ClaimRequestExportExcelButton } from '@features/claim-requests/pages/index/components/claim-request-export-excel-button'
import { ClaimRequestFetchNewEmptyState } from '@features/claim-requests/pages/index/components/claim-request-fetch-new-empty-state'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  assignNewToMe: vi.fn(),
  exportPageLiteExcel: vi.fn(),
  saveAs: vi.fn(),
  success: vi.fn(),
}))
vi.mock('@features/claim-requests/services/claim-request-service', () => ({
  claimRequestService: mocks,
}))
vi.mock('file-saver', () => ({ saveAs: mocks.saveAs }))
vi.mock('sonner', () => ({ toast: { success: mocks.success } }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
function mount(element: ReactNode) {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { mutations: { retry: false } } })
      }
    >
      {element}
    </QueryClientProvider>
  )
}
beforeEach(() => vi.clearAllMocks())
afterEach(cleanup)

it('uses the injected source exporter and exact file name', async () => {
  const blob = new Blob(['excel'])
  const exporter = vi.fn().mockResolvedValue(blob)
  const filters = {
    status: ['NEW'],
    sort: 'createdAt',
    direction: 'asc' as const,
  }
  mount(
    <ClaimRequestExportExcelButton filters={filters} exportExcel={exporter} />
  )
  fireEvent.click(screen.getByText('claimRequests.actions.downloadExcel'))
  await waitFor(() =>
    expect(mocks.saveAs).toHaveBeenCalledWith(blob, 'claim-requests.xlsx')
  )
  expect(exporter).toHaveBeenCalledWith({ filters })
  expect(mocks.exportPageLiteExcel).not.toHaveBeenCalled()
  expect(mocks.success).toHaveBeenCalledWith(
    'claimRequests.messages.excelDownloaded'
  )
})

it('fetches with source input order and invokes the callback without arguments', async () => {
  mocks.assignNewToMe.mockResolvedValue({})
  const onFetch = vi.fn()
  mount(<ClaimRequestFetchNewEmptyState onFetch={onFetch} />)
  fireEvent.change(
    screen.getByPlaceholderText('claimRequests.extContractIdPlaceholder'),
    { target: { value: '۱۲۳' } }
  )
  fireEvent.click(screen.getByText('claimRequests.fetchNewRequests'))
  await waitFor(() => expect(onFetch).toHaveBeenCalledWith())
  expect(mocks.assignNewToMe).toHaveBeenCalledWith({
    extContractId: '123',
    extPolicyId: undefined,
  })
})

it('allows fetching with no callback', async () => {
  mocks.assignNewToMe.mockResolvedValue({})
  mount(<ClaimRequestFetchNewEmptyState />)
  fireEvent.click(screen.getByText('claimRequests.fetchNewRequests'))
  await waitFor(() =>
    expect(mocks.assignNewToMe).toHaveBeenCalledWith({
      extContractId: undefined,
      extPolicyId: undefined,
    })
  )
})
