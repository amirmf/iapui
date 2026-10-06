import type { AgreementPartyApplFull } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type AgreementPartyApplDialog =
  'create' | 'bulkCreate' | 'delete' | 'deleteMethod' | 'view' | null

type AgreementPartyApplStore = {
  currentRow: AgreementPartyApplFull | null
  openDialog: AgreementPartyApplDialog
  open: AgreementPartyApplDialog
  rowSelection: RowSelectionState
  reset: () => void
  setCurrentRow: (row: AgreementPartyApplFull | null) => void
  setOpenDialog: (dialog: AgreementPartyApplDialog) => void
  setOpen: (dialog: AgreementPartyApplDialog) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useAgreementPartyApplStore = create<AgreementPartyApplStore>(
  (set) => ({
    currentRow: null,
    openDialog: null,
    open: null,
    rowSelection: {},
    reset: () =>
      set((state) =>
        state.currentRow === null &&
        state.openDialog === null &&
        Object.keys(state.rowSelection).length === 0
          ? state
          : { currentRow: null, openDialog: null, open: null, rowSelection: {} }
      ),
    setCurrentRow: (currentRow) =>
      set((state) =>
        state.currentRow === currentRow ? state : { currentRow }
      ),
    setOpenDialog: (openDialog) =>
      set((state) =>
        state.openDialog === openDialog
          ? state
          : { openDialog, open: openDialog }
      ),
    setOpen: (open) =>
      set((state) =>
        state.open === open ? state : { open, openDialog: open }
      ),
    setRowSelection: (updater) =>
      set((state) => {
        const rowSelection =
          typeof updater === 'function' ? updater(state.rowSelection) : updater
        return Object.is(state.rowSelection, rowSelection)
          ? state
          : { rowSelection }
      }),
  })
)

export const useAgreementPartyAppl = useAgreementPartyApplStore
