import type { BankAccount } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type BankAccountDialog = 'bulkDelete' | 'delete' | null

type BankAccountStore = {
  currentRow: BankAccount | null
  openDialog: BankAccountDialog
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentRow: (row: BankAccount | null) => void
  setOpenDialog: (dialog: BankAccountDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useBankAccountStore = create<BankAccountStore>((set) => ({
  currentRow: null,
  openDialog: null,
  reset: () => set({ currentRow: null, openDialog: null, rowSelection: {} }),
  rowSelection: {},
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))
