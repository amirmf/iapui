import type { AdminDocType } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type DocTypeDialog = 'bulkDelete' | 'delete' | 'details' | null

type DocTypeStore = {
  currentRow: AdminDocType | null
  editingRowId: string | null
  openDialog: DocTypeDialog
  rowSelection: RowSelectionState
  reset: () => void
  setCurrentRow: (row: AdminDocType | null) => void
  setEditingRowId: (id: string | null) => void
  setOpenDialog: (dialog: DocTypeDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useDocTypeStore = create<DocTypeStore>((set) => ({
  currentRow: null,
  editingRowId: null,
  openDialog: null,
  reset: () =>
    set({
      currentRow: null,
      editingRowId: null,
      openDialog: null,
      rowSelection: {},
    }),
  rowSelection: {},
  setCurrentRow: (currentRow) => set({ currentRow }),
  setEditingRowId: (editingRowId) => set({ editingRowId }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))
