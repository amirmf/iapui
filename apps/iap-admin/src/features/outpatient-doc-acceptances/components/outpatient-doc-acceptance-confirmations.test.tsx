// @vitest-environment jsdom
import type { ReactNode } from 'react'

import { OutpatientDocAcceptanceCancelDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-cancel-dialog'
import { OutpatientDocAcceptanceDeleteDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-delete-dialog'
import { OutpatientDocAcceptanceTerminateDialog } from '@features/outpatient-doc-acceptances/components/outpatient-doc-acceptance-terminate-dialog'
import { useOutpatientDocAcceptanceStore } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
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
  cancel: vi.fn(),
  terminate: vi.fn(),
  delete: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))
vi.mock(
  '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service',
  () => ({ outpatientDocAcceptanceService: mocks })
)
vi.mock('sonner', () => ({
  toast: { success: mocks.success, error: mocks.error },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: (props: {
    open: boolean
    title: ReactNode
    description: ReactNode
    onConfirm: () => void
    disableConfirm: boolean
  }) =>
    props.open ? (
      <div>
        {props.title}
        {props.description}
        <button disabled={props.disableConfirm} onClick={props.onConfirm}>
          confirm
        </button>
      </div>
    ) : null,
}))

beforeEach(() => {
  vi.resetAllMocks()
  useOutpatientDocAcceptanceStore.getState().reset()
})
afterEach(cleanup)

const cases = [
  ['cancel', OutpatientDocAcceptanceCancelDialog, 'cancelled'],
  ['terminate', OutpatientDocAcceptanceTerminateDialog, 'terminated'],
  ['delete', OutpatientDocAcceptanceDeleteDialog, 'deleted'],
] as const

describe.each(cases)(
  '%s acceptance confirmation',
  (mode, Component, message) => {
    function mount() {
      const client = new QueryClient({
        defaultOptions: { mutations: { retry: false } },
      })
      const invalidate = vi.spyOn(client, 'invalidateQueries')
      useOutpatientDocAcceptanceStore.getState().openDialog(mode, {
        id: 'acceptance-9',
        exId: 17,
        letterNo: 'letter-4',
      })
      render(
        <QueryClientProvider client={client}>
          <Component />
        </QueryClientProvider>
      )
      return invalidate
    }

    it('submits the current id and clears the row only after success', async () => {
      mocks[mode].mockResolvedValue(undefined)
      const invalidate = mount()
      expect(screen.getByText('letter-4', { exact: false })).toBeDefined()
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
      await waitFor(() =>
        expect(useOutpatientDocAcceptanceStore.getState().open).toBeNull()
      )
      expect(mocks[mode].mock.calls[0]?.[0]).toBe('acceptance-9')
      expect(invalidate).toHaveBeenCalledWith({
        queryKey: ['outpatient-doc-acceptances'],
      })
      expect(mocks.success).toHaveBeenCalledWith(
        `outpatientDocAcceptances.messages.${message}`
      )
      expect(useOutpatientDocAcceptanceStore.getState().currentRow).toBeNull()
    })

    it('keeps confirmation and the selected row after a rejected operation', async () => {
      mocks[mode].mockRejectedValue(new Error('rejected'))
      mount()
      fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
      await waitFor(() => expect(mocks[mode]).toHaveBeenCalled())
      await waitFor(() =>
        expect(
          screen
            .getByRole('button', { name: 'confirm' })
            .hasAttribute('disabled')
        ).toBe(false)
      )
      expect(useOutpatientDocAcceptanceStore.getState().open).toBe(mode)
      expect(useOutpatientDocAcceptanceStore.getState().currentRow?.id).toBe(
        'acceptance-9'
      )
      expect(mocks.success).not.toHaveBeenCalled()
    })
  }
)
