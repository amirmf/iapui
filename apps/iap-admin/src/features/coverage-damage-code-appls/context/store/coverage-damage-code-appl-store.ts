import type { CoverageDamageCodeApplFull } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type CoverageDamageCodeApplDialog =
  'create' | 'deleteMethod' | 'edit' | 'view' | null

type CoverageDamageCodeApplStore = {
  currentRow: CoverageDamageCodeApplFull | null
  openDialog: CoverageDamageCodeApplDialog
  rowSelection: RowSelectionState
  setCurrentRow: (row: CoverageDamageCodeApplFull | null) => void
  setOpenDialog: (dialog: CoverageDamageCodeApplDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useCoverageDamageCodeApplStore =
  create<CoverageDamageCodeApplStore>((set) => ({
    currentRow: null,
    openDialog: null,
    rowSelection: {},
    setCurrentRow: (currentRow) => set({ currentRow }),
    setOpenDialog: (openDialog) => set({ openDialog }),
    setRowSelection: (updater) =>
      set((state) => ({
        rowSelection:
          typeof updater === 'function' ? updater(state.rowSelection) : updater,
      })),
  }))
