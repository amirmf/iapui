import type { Branch } from '@iap/api-types'
import { create } from 'zustand'

export type BranchDialog = 'create' | 'delete' | 'edit' | null

type BranchStore = {
  currentRow: Branch | null
  openDialog: BranchDialog
  reset: () => void
  setCurrentRow: (row: Branch | null) => void
  setOpenDialog: (dialog: BranchDialog) => void
}

export const useBranchStore = create<BranchStore>((set) => ({
  currentRow: null,
  openDialog: null,
  reset: () => set({ currentRow: null, openDialog: null }),
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpenDialog: (openDialog) => set({ openDialog }),
}))
