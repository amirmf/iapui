import type { Agreement } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export interface SubUsersAgreementsState {
  reset: () => void
  rowSelection: RowSelectionState
  selectedAgreement: Agreement[]
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  setSelectedAgreement: (selectedAgreement: Agreement[]) => void
}

export const useSubUsersAgreementsStore = create<SubUsersAgreementsState>(
  (set) => ({
    reset: () => set({ rowSelection: {}, selectedAgreement: [] }),
    rowSelection: {},
    selectedAgreement: [],
    setRowSelection: (updater) =>
      set((state) => ({
        rowSelection:
          typeof updater === 'function' ? updater(state.rowSelection) : updater,
      })),
    setSelectedAgreement: (selectedAgreement) => set({ selectedAgreement }),
  })
)

export const useSubUsersAgreements = useSubUsersAgreementsStore
