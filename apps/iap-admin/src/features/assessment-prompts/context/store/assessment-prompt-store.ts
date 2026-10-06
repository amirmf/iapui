import type { AssessmentPrompt } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type AssessmentPromptDialog =
  'bulkDelete' | 'create' | 'edit' | 'view' | null

type AssessmentPromptStore = {
  currentRow: AssessmentPrompt | null
  open: AssessmentPromptDialog
  rowSelection: RowSelectionState
  reset: () => void
  setCurrentRow: (row: AssessmentPrompt | null) => void
  setOpen: (dialog: AssessmentPromptDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

const initialState = {
  currentRow: null,
  open: null,
  rowSelection: {},
} satisfies Pick<AssessmentPromptStore, 'currentRow' | 'open' | 'rowSelection'>

export const useAssessmentPrompt = create<AssessmentPromptStore>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpen: (open) => set(open === null ? { open, currentRow: null } : { open }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))
