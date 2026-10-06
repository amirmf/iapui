import type { SubUser, UserAccount } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type SubUserDialogType = 'details' | 'editor' | 'releaseAssignments'

export interface SubUserState {
  currentRow: SubUser | null
  open: SubUserDialogType | null
  reset: () => void
  rowSelection: RowSelectionState
  selectedUserAccount: UserAccount[]
  setCurrentRow: (currentRow: SubUser | null) => void
  setOpen: (open: SubUserDialogType | null) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  setSelectedUserAccount: (selectedUserAccount: UserAccount[]) => void
}

export const useSubUserStore = create<SubUserState>((set) => ({
  currentRow: null,
  open: null,
  reset: () =>
    set({
      currentRow: null,
      open: null,
      rowSelection: {},
      selectedUserAccount: [],
    }),
  rowSelection: {},
  selectedUserAccount: [],
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpen: (open) => set({ open }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
  setSelectedUserAccount: (selectedUserAccount) => set({ selectedUserAccount }),
}))

export const useSubUser = useSubUserStore
