import type { Agreement } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type AgreementDialog =
  'create' | 'deleteMethod' | 'edit' | 'initializeCoverageAppls' | 'view' | null
type AgreementStore = {
  currentRow: Agreement | null
  openDialog: AgreementDialog
  reset: () => void
  rowSelection: RowSelectionState
  selectedAgreement: Agreement[]
  setCurrentRow: (row: Agreement | null) => void
  setOpenDialog: (dialog: AgreementDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  setSelectedAgreement: (agreements: Agreement[]) => void
}

export const useAgreementStore = create<AgreementStore>((set) => ({
  currentRow: null,
  openDialog: null,
  reset: () =>
    set({
      currentRow: null,
      openDialog: null,
      rowSelection: {},
      selectedAgreement: [],
    }),
  rowSelection: {},
  selectedAgreement: [],
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
  setSelectedAgreement: (selectedAgreement) => set({ selectedAgreement }),
}))
