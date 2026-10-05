import type { DamageCode, DamageCodePricing } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type DamageCodeDialog =
  'create' | 'deleteMethod' | 'edit' | 'pricing' | 'view' | null
export type DamageCodePricingDialog =
  'create' | 'deleteMethod' | 'edit' | 'view' | null

type DamageCodeStore = {
  currentPricing: DamageCodePricing | null
  currentRow: DamageCode | null
  openDialog: DamageCodeDialog
  openPricingDialog: DamageCodePricingDialog
  pricingRowSelection: RowSelectionState
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentPricing: (pricing: DamageCodePricing | null) => void
  setCurrentRow: (row: DamageCode | null) => void
  setOpenDialog: (dialog: DamageCodeDialog) => void
  setOpenPricingDialog: (dialog: DamageCodePricingDialog) => void
  setPricingRowSelection: (updater: Updater<RowSelectionState>) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

const resolveUpdater = (
  updater: Updater<RowSelectionState>,
  previous: RowSelectionState
) => (typeof updater === 'function' ? updater(previous) : updater)

export const useDamageCodeStore = create<DamageCodeStore>((set) => ({
  currentPricing: null,
  currentRow: null,
  openDialog: null,
  openPricingDialog: null,
  pricingRowSelection: {},
  reset: () =>
    set({
      currentPricing: null,
      currentRow: null,
      openDialog: null,
      openPricingDialog: null,
      pricingRowSelection: {},
      rowSelection: {},
    }),
  rowSelection: {},
  setCurrentPricing: (currentPricing) => set({ currentPricing }),
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setOpenPricingDialog: (openPricingDialog) => set({ openPricingDialog }),
  setPricingRowSelection: (updater) =>
    set((state) => ({
      pricingRowSelection: resolveUpdater(updater, state.pricingRowSelection),
    })),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection: resolveUpdater(updater, state.rowSelection),
    })),
}))
