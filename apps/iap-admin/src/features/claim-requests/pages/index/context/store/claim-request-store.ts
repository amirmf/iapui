import type { ClaimRequest } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type ClaimRequestDialog =
  | 'bulkDataExtraction'
  | 'bulkDelete'
  | 'bulkGenerateAndSend'
  | 'bulkStatusChange'
  | 'delete'
  | 'assignToMe'
  | 'removeMyAssessment'
  | null

type ClaimRequestStore = {
  clearRowSelection: () => void
  currentRow: ClaimRequest | null
  openDialog: ClaimRequestDialog
  rowSelection: RowSelectionState
  reset: () => void
  setCurrentRow: (claimRequest: ClaimRequest | null) => void
  setOpenDialog: (dialog: ClaimRequestDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useClaimRequestStore = create<ClaimRequestStore>((set) => ({
  clearRowSelection: () => set({ rowSelection: {} }),
  currentRow: null,
  openDialog: null,
  reset: () => set({ currentRow: null, openDialog: null, rowSelection: {} }),
  rowSelection: {},
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))
