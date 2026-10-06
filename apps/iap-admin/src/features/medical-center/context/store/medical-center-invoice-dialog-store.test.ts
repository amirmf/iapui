import { useMedicalCenterInvoiceDialog } from '@features/medical-center/context/store/medical-center-invoice-dialog-store'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(() => useMedicalCenterInvoiceDialog.getState().reset())
describe('invoice dialog store', () => {
  it('selects one dialog and clears its invoice on close/reset', () => {
    const invoice = { id: 'invoice-1', records: [] }
    useMedicalCenterInvoiceDialog.getState().openDialog('view', invoice)
    expect(useMedicalCenterInvoiceDialog.getState()).toMatchObject({
      activeDialog: 'view',
      selectedInvoice: invoice,
    })
    useMedicalCenterInvoiceDialog.getState().openDialog('edit', invoice)
    expect(useMedicalCenterInvoiceDialog.getState().activeDialog).toBe('edit')
    useMedicalCenterInvoiceDialog.getState().closeDialog()
    expect(useMedicalCenterInvoiceDialog.getState()).toMatchObject({
      activeDialog: null,
      selectedInvoice: null,
    })
    useMedicalCenterInvoiceDialog.getState().openDialog('delete', invoice)
    useMedicalCenterInvoiceDialog.getState().reset()
    expect(useMedicalCenterInvoiceDialog.getState()).toMatchObject({
      activeDialog: null,
      selectedInvoice: null,
    })
  })
})
