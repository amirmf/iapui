import { type SupportPage } from '@iap/api-types'
import { create } from 'zustand'

export type SupportPageDialogType = 'create' | 'edit' | 'delete'

export interface SupportPageState {
  open: SupportPageDialogType | null
  currentRow: SupportPage | null
  setOpen: (open: SupportPageDialogType | null) => void
  setCurrentRow: (currentRow: SupportPage | null) => void
  reset: () => void
}

export const useSupportPageStore = create<SupportPageState>((set) => ({
  open: null,
  currentRow: null,
  setOpen: (open) => set({ open }),
  setCurrentRow: (currentRow) => set({ currentRow }),
  reset: () => set({ open: null, currentRow: null }),
}))

export const useSupportPage = useSupportPageStore
