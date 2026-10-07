import { type SupportFeature } from '@iap/api-types'
import { create } from 'zustand'

export type SupportFeatureDialogType = 'create' | 'edit' | 'delete'

export interface SupportFeatureState {
  open: SupportFeatureDialogType | null
  currentRow: SupportFeature | null
  setOpen: (open: SupportFeatureDialogType | null) => void
  setCurrentRow: (currentRow: SupportFeature | null) => void
  reset: () => void
}

export const useSupportFeatureStore = create<SupportFeatureState>((set) => ({
  open: null,
  currentRow: null,
  setOpen: (open) => set({ open }),
  setCurrentRow: (currentRow) => set({ currentRow }),
  reset: () => set({ open: null, currentRow: null }),
}))

export const useSupportFeature = useSupportFeatureStore
