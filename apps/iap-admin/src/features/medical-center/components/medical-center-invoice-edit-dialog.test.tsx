import { MedicalCenterInvoiceEditDialog } from '@features/medical-center/components/medical-center-invoice-edit-dialog'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  activeDialog: 'edit',
  selectedInvoice: { id: 'invoice-1' },
  closeDialog: vi.fn(),
  mutate: vi.fn(),
  invoice: {
    id: 'invoice-1',
    documentNumber: '42',
    date: null as string | null,
    printDate: null,
    issueDate: null,
    totalAmount: 100,
    state: 'SUBMITTED',
    records: [],
    createdBy: 'original-author',
  },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'fa' } }),
}))
vi.mock(
  '@features/medical-center/context/store/medical-center-invoice-dialog-store',
  () => ({
    useMedicalCenterInvoiceDialog: (
      selector: (value: typeof state) => unknown
    ) => selector(state),
  })
)
vi.mock(
  '@features/medical-center/queries/medical-center-invoice-query',
  () => ({
    useMedicalCenterInvoice: () => ({
      data: state.invoice,
      isError: false,
      isLoading: false,
    }),
    useUpdateMedicalCenterInvoice: () => ({
      mutate: state.mutate,
      isPending: false,
    }),
  })
)
afterEach(cleanup)
beforeEach(() => {
  vi.clearAllMocks()
  state.invoice.date = null
})
it('merges changed amount while retaining untouched null dates and invoice detail', async () => {
  render(<MedicalCenterInvoiceEditDialog />)
  fireEvent.change(screen.getByLabelText('medicalCenter.fields.totalAmount'), {
    target: { value: '250' },
  })
  fireEvent.click(screen.getByText('form.update'))
  await waitFor(() => expect(state.mutate).toHaveBeenCalled())
  expect(state.mutate.mock.calls[0]?.[0]).toEqual({
    id: 'invoice-1',
    invoice: { ...state.invoice, totalAmount: 250 },
  })
})

it('uses the reference clear label and preserves clearing as an explicit dirty date edit', async () => {
  state.invoice.date = '2026-01-01T00:00:00.000Z'
  render(<MedicalCenterInvoiceEditDialog />)
  const clear = await screen.findByRole('button', { name: 'common.clear' })
  const dateInput = screen.getByLabelText(
    'medicalCenter.fields.date'
  ) as HTMLInputElement
  expect(dateInput.value).not.toBe('')
  fireEvent.click(clear)
  fireEvent.click(screen.getByText('form.update'))
  await waitFor(() => expect(state.mutate).toHaveBeenCalled())
  expect(state.mutate.mock.calls[0]?.[0].invoice.date).toBe('')
})
