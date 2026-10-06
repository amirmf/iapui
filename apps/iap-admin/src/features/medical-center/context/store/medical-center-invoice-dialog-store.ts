import type { MedicalCenterInvoice } from '@iap/api-types'
import { create } from 'zustand'

type MedicalCenterInvoiceDialogType = 'view' | 'edit' | 'delete'
interface MedicalCenterInvoiceDialogState {
  activeDialog: MedicalCenterInvoiceDialogType | null
  selectedInvoice: MedicalCenterInvoice | null
  openDialog: (
    dialog: MedicalCenterInvoiceDialogType,
    invoice: MedicalCenterInvoice
  ) => void
  closeDialog: () => void
  reset: () => void
}
export const useMedicalCenterInvoiceDialog =
  create<MedicalCenterInvoiceDialogState>((set) => ({
    activeDialog: null,
    selectedInvoice: null,
    openDialog: (activeDialog, selectedInvoice) =>
      set({ activeDialog, selectedInvoice }),
    closeDialog: () => set({ activeDialog: null, selectedInvoice: null }),
    reset: () => set({ activeDialog: null, selectedInvoice: null }),
  }))
