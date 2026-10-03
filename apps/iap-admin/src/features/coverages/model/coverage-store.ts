import type { Coverage } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type CoverageDialog = 'create' | 'deleteMethod' | 'edit' | 'view' | null

type CoverageStore = {
  currentRow: Coverage | null
  openDialog: CoverageDialog
  rowSelection: RowSelectionState
  setCurrentRow: (row: Coverage | null) => void
  setOpenDialog: (dialog: CoverageDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useCoverageStore = create<CoverageStore>((set) => ({
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
