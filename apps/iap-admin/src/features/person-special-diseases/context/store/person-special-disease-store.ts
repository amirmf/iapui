import type { PersonSpecialDisease } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type PersonSpecialDiseaseDialog =
  'bulkDelete' | 'create' | 'delete' | 'edit' | null

type PersonSpecialDiseaseStore = {
  currentRow: PersonSpecialDisease | null
  openDialog: PersonSpecialDiseaseDialog
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentRow: (row: PersonSpecialDisease | null) => void
  setOpenDialog: (dialog: PersonSpecialDiseaseDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

const initialState = {
  currentRow: null,
  openDialog: null,
  rowSelection: {},
} satisfies Pick<
  PersonSpecialDiseaseStore,
  'currentRow' | 'openDialog' | 'rowSelection'
>

export const usePersonSpecialDiseaseStore = create<PersonSpecialDiseaseStore>(
  (set) => ({
    ...initialState,
    reset: () => set(initialState),
    setCurrentRow: (currentRow) => set({ currentRow }),
    setOpenDialog: (openDialog) => set({ openDialog }),
    setRowSelection: (updater) =>
      set((state) => ({
        rowSelection:
          typeof updater === 'function' ? updater(state.rowSelection) : updater,
      })),
  })
)
