import { type SupportQuestion } from '@iap/api-types'
import { type RowSelectionState, type Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type SupportQuestionDialogType =
  'create' | 'edit' | 'view' | 'delete' | 'bulkDelete'

export interface SupportQuestionState {
  open: SupportQuestionDialogType | null
  setOpen: (open: SupportQuestionDialogType | null) => void
  currentRow: SupportQuestion | null
  setCurrentRow: (currentRow: SupportQuestion | null) => void
  rowSelection: RowSelectionState
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  reset: () => void
}

export const useSupportQuestionStore = create<SupportQuestionState>((set) => ({
  open: null,
  currentRow: null,
  rowSelection: {},
  setOpen: (open) => set({ open }),
  setCurrentRow: (currentRow) => set({ currentRow }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
  reset: () =>
    set({
      open: null,
      currentRow: null,
      rowSelection: {},
    }),
}))

export const useSupportQuestion = useSupportQuestionStore
