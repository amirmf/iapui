import type { AiAssessmentRule } from '@iap/api-types'
import type { RowSelectionState } from '@tanstack/react-table'
import { create } from 'zustand'

export type AiAssessmentRuleDialogType =
  'bulkDelete' | 'create' | 'delete' | 'edit'

export type RowSelectionUpdater =
  RowSelectionState | ((previous: RowSelectionState) => RowSelectionState)

export interface AiAssessmentRuleState {
  currentRow: AiAssessmentRule | null
  open: AiAssessmentRuleDialogType | null
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentRow: (row: AiAssessmentRule | null) => void
  setOpen: (open: AiAssessmentRuleDialogType | null) => void
  setRowSelection: (updater: RowSelectionUpdater) => void
}

const initialState = {
  currentRow: null,
  open: null,
  rowSelection: {},
} satisfies Pick<AiAssessmentRuleState, 'currentRow' | 'open' | 'rowSelection'>

export const useAiAssessmentRuleStore = create<AiAssessmentRuleState>(
  (set) => ({
    ...initialState,
    reset: () => set(initialState),
    setCurrentRow: (currentRow) => set({ currentRow }),
    setOpen: (open) =>
      set(open === null ? { currentRow: null, open } : { open }),
    setRowSelection: (updater) =>
      set((state) => ({
        rowSelection:
          typeof updater === 'function' ? updater(state.rowSelection) : updater,
      })),
  })
)

export const useAiAssessmentRule = useAiAssessmentRuleStore
