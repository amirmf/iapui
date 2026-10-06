import type { OutpatientDocAcceptance } from '@iap/api-types'
import { create } from 'zustand'

export type OutpatientDocAcceptanceDialogType =
  | 'create'
  | 'edit'
  | 'delete'
  | 'deleteMethod'
  | 'view'
  | 'manageClaim'
  | 'viewClaim'
  | 'manageIssuance'
  | 'viewIssuance'
  | 'manageDmgCases'
  | 'generate'
  | 'generateAdjustment'
  | 'send'
  | 'cancel'
  | 'terminate'
  | null

type OutpatientDocAcceptanceStore = {
  open: OutpatientDocAcceptanceDialogType
  currentRow: OutpatientDocAcceptance | null
  setOpen: (open: OutpatientDocAcceptanceDialogType) => void
  setCurrentRow: (row: OutpatientDocAcceptance | null) => void
  openDialog: (
    dialog: Exclude<OutpatientDocAcceptanceDialogType, null>,
    row?: OutpatientDocAcceptance | null
  ) => void
  closeDialog: (options?: { clearRow?: boolean }) => void
  reset: () => void
}

export const useOutpatientDocAcceptanceStore =
  create<OutpatientDocAcceptanceStore>((set) => ({
    open: null,
    currentRow: null,
    setOpen: (open) => set({ open }),
    setCurrentRow: (currentRow) => set({ currentRow }),
    openDialog: (dialog, row) =>
      set((state) => ({
        open: dialog,
        currentRow: row === undefined ? state.currentRow : row,
      })),
    closeDialog: (options) =>
      set((state) => ({
        open: null,
        currentRow: options?.clearRow ? null : state.currentRow,
      })),
    reset: () => set({ open: null, currentRow: null }),
  }))

export type { OutpatientDocAcceptanceStore }

export function useOutpatientDocAcceptance<T>(
  selector: (state: OutpatientDocAcceptanceStore) => T
): T
export function useOutpatientDocAcceptance(): OutpatientDocAcceptanceStore
export function useOutpatientDocAcceptance<T>(
  selector?: (state: OutpatientDocAcceptanceStore) => T
) {
  return useOutpatientDocAcceptanceStore(
    selector ?? ((state) => state as unknown as T)
  )
}
