import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import { agreementService } from '@features/agreements/services/agreement-service'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { AgreementDeleteMethodDialog } from './agreement-delete-method-dialog'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))
const id = '11111111-1111-4111-8111-111111111111'

function mount(onError = vi.fn()) {
  const client = new QueryClient({
    mutationCache: new MutationCache({ onError }),
    defaultOptions: { mutations: { retry: false } },
  })
  useAgreementStore.setState({
    openDialog: 'deleteMethod',
    selectedAgreement: [{ id }],
    rowSelection: { 0: true },
  })
  render(
    <QueryClientProvider client={client}>
      <AgreementDeleteMethodDialog />
    </QueryClientProvider>
  )
  return client
}

describe('Reference main bulk delete', () => {
  beforeAll(async () => {
    await i18nReady
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.useRealTimers()
    useAgreementStore.getState().reset()
  })

  it.each(['hard', 'soft'] as const)(
    'preserves %s success key and closes without waiting for invalidation',
    async (method) => {
      const remove =
        method === 'hard'
          ? vi.spyOn(agreementService, 'bulkDelete').mockResolvedValue()
          : vi.spyOn(agreementService, 'softDeleteBulk').mockResolvedValue([])
      const client = mount()
      const invalidate = vi
        .spyOn(client, 'invalidateQueries')
        .mockImplementation(() => new Promise(() => {}))
      const buttonLabel = i18n.t(
        method === 'hard' ? 'common.delete' : 'common.softDelete'
      )
      fireEvent.click(screen.getByRole('button', { name: buttonLabel }))
      fireEvent.click(screen.getByRole('button', { name: buttonLabel }))
      await waitFor(() => expect(remove).toHaveBeenCalled())
      expect(remove.mock.calls[0]?.[0]).toEqual([id])
      if (method === 'soft')
        expect(remove.mock.calls[0]?.[1]).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith(
          i18n.t(
            method === 'hard'
              ? 'common.deleteSuccess'
              : 'common.softDeleteSuccess'
          )
        )
      )
      expect(invalidate).toHaveBeenCalledWith({ queryKey: ['agreements'] })
      await waitFor(() =>
        expect(useAgreementStore.getState()).toMatchObject({
          openDialog: null,
          rowSelection: {},
        })
      )
    }
  )

  it('blocks pending close and reports a rejection globally while retaining confirmation', async () => {
    let reject!: (reason: Error) => void
    const failure = new Error('backend rejected delete')
    vi.spyOn(agreementService, 'bulkDelete').mockImplementation(
      () =>
        new Promise((_, rejectPromise) => {
          reject = rejectPromise
        })
    )
    const onError = vi.fn()
    mount(onError)
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole('button', { name: i18n.t('common.dialog.cancel') })
          .hasAttribute('disabled')
      ).toBe(true)
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.dialog.cancel') })
    )
    expect(useAgreementStore.getState().openDialog).toBe('deleteMethod')
    await act(async () => {
      reject(failure)
    })
    await waitFor(() => expect(onError).toHaveBeenCalled())
    expect(onError.mock.calls[0]?.[0]).toBe(failure)
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    expect(useAgreementStore.getState().rowSelection).toEqual({ 0: true })
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('resets the method only after the source 300ms close delay', () => {
    vi.useFakeTimers()
    mount()
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.delete') })
    )
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.dialog.cancel') })
    )
    act(() => {
      vi.advanceTimersByTime(299)
      useAgreementStore.getState().setOpenDialog('deleteMethod')
    })
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: i18n.t('common.dialog.cancel') })
    )
    act(() => {
      vi.advanceTimersByTime(300)
    })
    act(() => useAgreementStore.getState().setOpenDialog('deleteMethod'))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })
})
