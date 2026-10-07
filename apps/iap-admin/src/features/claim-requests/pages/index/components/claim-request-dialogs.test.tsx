// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { ClaimRequestBulkDeleteDialog } from '@features/claim-requests/pages/index/components/claim-request-bulk-delete-dialog'
import { ClaimRequestDeleteDialog } from '@features/claim-requests/pages/index/components/claim-request-delete-dialog'
import { ClaimRequestRowActionsAssignToMeConfirmDialog } from '@features/claim-requests/pages/index/components/claim-request-row-actions-assign-to-me-confirm-dialog'
import { ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog } from '@features/claim-requests/pages/index/components/claim-request-row-actions-remove-my-assessment-confirm-dialog'
import { useClaimRequestStore } from '@features/claim-requests/pages/index/context/store/claim-request-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  updateDocType: vi.fn(),
  delete: vi.fn(),
  bulkDelete: vi.fn(),
  assignToMe: vi.fn(),
  assignToMeWithStatus: vi.fn(),
  navigate: vi.fn(),
}))
vi.mock('@features/claim-requests/services/claim-request-service', () => ({
  claimRequestService: mocks,
}))
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: mocks.navigate }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: (props: {
    open: boolean
    isLoading: boolean
    onConfirm: () => void
    onOpenChange: (open: boolean) => void
    presentation: string
  }) =>
    props.open ? (
      <div data-presentation={props.presentation}>
        <button disabled={props.isLoading} onClick={props.onConfirm}>
          confirm
        </button>
        <button
          onClick={() => {
            if (!props.isLoading) props.onOpenChange(false)
          }}
        >
          cancel
        </button>
      </div>
    ) : null,
}))

function mount(element: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{element}</QueryClientProvider>
  )
}
function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}
beforeEach(() => {
  vi.clearAllMocks()
  useClaimRequestStore.getState().reset()
  useClaimRequestStore.setState({
    currentRow: {
      id: 'claim-1',
      status: 'DELEGATED',
      docType: { id: 'doc-1' },
    },
  })
})
afterEach(cleanup)

describe('ClaimRequest dialog lifecycle', () => {
  it('awaits assessment refresh and prevents closing during the refresh', async () => {
    const refresh = deferred()
    mocks.updateDocType.mockResolvedValue({})
    useClaimRequestStore.getState().setOpenDialog('removeMyAssessment')
    mount(
      <ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog
        onSuccess={() => refresh.promise}
      />
    )
    fireEvent.click(screen.getByText('confirm'))
    await waitFor(() =>
      expect(mocks.updateDocType).toHaveBeenCalledWith({
        claimRequestId: 'claim-1',
        newDocType: 'doc-1',
      })
    )
    fireEvent.click(screen.getByText('cancel'))
    expect(useClaimRequestStore.getState().openDialog).toBe(
      'removeMyAssessment'
    )
    refresh.resolve()
    await waitFor(() =>
      expect(useClaimRequestStore.getState().openDialog).toBeNull()
    )
    expect(useClaimRequestStore.getState().currentRow).toBeNull()
  })

  it('keeps rejected assessment confirmation open', async () => {
    mocks.updateDocType.mockRejectedValue(new Error('failed'))
    useClaimRequestStore.getState().setOpenDialog('removeMyAssessment')
    const refresh = vi.fn()
    mount(
      <ClaimRequestRowActionsRemoveMyAssessmentConfirmDialog
        onSuccess={refresh}
      />
    )
    fireEvent.click(screen.getByText('confirm'))
    await waitFor(() =>
      expect((screen.getByText('confirm') as HTMLButtonElement).disabled).toBe(
        false
      )
    )
    expect(refresh).not.toHaveBeenCalled()
    expect(useClaimRequestStore.getState().openDialog).toBe(
      'removeMyAssessment'
    )
  })

  it('awaits delegated assignment refresh before closing and navigating', async () => {
    const refresh = deferred()
    mocks.assignToMeWithStatus.mockResolvedValue({ id: 'updated-claim' })
    useClaimRequestStore.getState().setOpenDialog('assignToMe')
    mount(
      <ClaimRequestRowActionsAssignToMeConfirmDialog
        onSuccess={() => refresh.promise}
      />
    )
    fireEvent.click(screen.getByText('confirm'))
    await waitFor(() =>
      expect(mocks.assignToMeWithStatus).toHaveBeenCalledWith('claim-1', {
        claimRequestStatus: 'IN_ASSESSMENT',
      })
    )
    expect(mocks.navigate).not.toHaveBeenCalled()
    refresh.resolve()
    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({
        params: { claimRequestId: 'updated-claim' },
        to: '/claim-requests/$claimRequestId/claim-request-management/',
      })
    )
    expect(useClaimRequestStore.getState().openDialog).toBeNull()
  })

  it('closes bulk deletion and clears selection without awaiting refresh', async () => {
    const refresh = deferred()
    mocks.bulkDelete.mockResolvedValue(undefined)
    useClaimRequestStore.setState({
      openDialog: 'bulkDelete',
      rowSelection: { 'claim-1': true },
    })
    mount(
      <ClaimRequestBulkDeleteDialog
        claimRequestIds={['claim-1']}
        onSuccess={() => refresh.promise}
      />
    )
    fireEvent.click(screen.getByText('confirm'))
    await waitFor(() =>
      expect(useClaimRequestStore.getState().openDialog).toBeNull()
    )
    expect(mocks.bulkDelete).toHaveBeenCalledWith(['claim-1'])
    expect(useClaimRequestStore.getState().rowSelection).toEqual({})
    refresh.resolve()
  })

  it('closes deletion without awaiting refresh and delays row cleanup by 500 ms', async () => {
    const refresh = deferred()
    mocks.delete.mockResolvedValue(undefined)
    useClaimRequestStore.getState().setOpenDialog('delete')
    const timeout = vi.spyOn(globalThis, 'setTimeout')
    mount(<ClaimRequestDeleteDialog onSuccess={() => refresh.promise} />)
    fireEvent.click(screen.getByText('confirm'))
    await waitFor(() =>
      expect(useClaimRequestStore.getState().openDialog).toBeNull()
    )
    expect(mocks.delete).toHaveBeenCalledWith('claim-1')
    expect(timeout).toHaveBeenCalledWith(expect.any(Function), 500)
    expect(useClaimRequestStore.getState().currentRow?.id).toBe('claim-1')
    refresh.resolve()
    timeout.mockRestore()
  })
})
