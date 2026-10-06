import { type ReactNode, useEffect } from 'react'

import type { AssignementRule } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type AssignementRuleDialogType =
  'create' | 'edit' | 'delete' | 'bulkDelete'

export interface AssignementRuleState {
  currentRow: AssignementRule | null
  open: AssignementRuleDialogType | null
  openDialog: AssignementRuleDialogType | null
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentRow: (row: AssignementRule | null) => void
  setOpen: (open: AssignementRuleDialogType | null) => void
  setOpenDialog: (open: AssignementRuleDialogType | null) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

const initialState = {
  currentRow: null,
  open: null,
  openDialog: null,
  rowSelection: {},
} satisfies Pick<
  AssignementRuleState,
  'currentRow' | 'open' | 'openDialog' | 'rowSelection'
>

// eslint-disable-next-line react-refresh/only-export-components
export const useAssignementRuleStore = create<AssignementRuleState>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpen: (open) => set({ open, openDialog: open }),
  setOpenDialog: (open) => set({ open, openDialog: open }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))

export function AssignementRuleProvider({ children }: { children: ReactNode }) {
  const reset = useAssignementRuleStore((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAssignementRule = useAssignementRuleStore
export default AssignementRuleProvider
