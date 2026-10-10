import { MyClaimRequestDeleteDialog } from '@features/my-claims/components/my-claim-request-delete-dialog'
import { useMyClaimRequestStore } from '@features/my-claims/context/store/my-claim-request-store'
import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

function mount(refetch = vi.fn()) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  render(
    <QueryClientProvider client={client}>
      <MyClaimRequestDeleteDialog refetch={refetch} />
    </QueryClientProvider>
  )
  return refetch
}
beforeEach(() => {
  useMyClaimRequestStore.setState({
    open: 'delete',
    currentRow: { id: 'claim-id', status: 'RETURN' },
  })
})
afterEach(() => {
  cleanup()
  useMyClaimRequestStore.getState().reset()
  vi.restoreAllMocks()
})

describe('delete confirmation', () => {
  it('keeps rejected confirmation and row open', async () => {
    vi.spyOn(myClaimRequestService, 'delete').mockRejectedValue(
      new Error('failure')
    )
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'common.delete' }))
    await waitFor(() =>
      expect(myClaimRequestService.delete).toHaveBeenCalledWith(
        'claim-id',
        expect.anything()
      )
    )
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'common.delete',
          }) as HTMLButtonElement
        ).disabled
      ).toBe(false)
    )
    expect(useMyClaimRequestStore.getState().open).toBe('delete')
    expect(useMyClaimRequestStore.getState().currentRow?.id).toBe('claim-id')
    expect(toast.success).not.toHaveBeenCalled()
  })
  it('refetches without awaiting, closes on success and clears row after 500ms', async () => {
    vi.spyOn(myClaimRequestService, 'delete').mockResolvedValue(undefined)
    const refetch = vi.fn(() => new Promise<void>(() => {}))
    mount(refetch)
    fireEvent.click(screen.getByRole('button', { name: 'common.delete' }))
    await waitFor(() => expect(refetch).toHaveBeenCalledOnce())
    expect(toast.success).toHaveBeenCalledWith('common.deleteSuccess')
    expect(useMyClaimRequestStore.getState().open).toBeNull()
    expect(useMyClaimRequestStore.getState().currentRow?.id).toBe('claim-id')
    await waitFor(() =>
      expect(useMyClaimRequestStore.getState().currentRow).toBeNull()
    )
  })
  it('disables both actions while deletion is pending', async () => {
    let resolve!: () => void
    vi.spyOn(myClaimRequestService, 'delete').mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done
        })
    )
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'common.delete' }))
    await waitFor(() =>
      expect(
        (
          screen.getByRole('button', {
            name: 'common.delete',
          }) as HTMLButtonElement
        ).disabled
      ).toBe(true)
    )
    expect(
      (
        screen.getByRole('button', {
          name: 'common.dialog.cancel',
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    await act(async () => resolve())
  })
})
