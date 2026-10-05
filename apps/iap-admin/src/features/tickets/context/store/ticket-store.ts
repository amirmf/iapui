import type { SupportTicket } from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

type TicketSheet = 'detail'

type TicketState = {
  currentRow: SupportTicket | null
  open: TicketSheet | null
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentRow: (currentRow: SupportTicket | null) => void
  setOpen: (open: TicketSheet | null) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useTicketStore = create<TicketState>((set) => ({
  currentRow: null,
  open: null,
  reset: () => set({ currentRow: null, open: null, rowSelection: {} }),
  rowSelection: {},
  setCurrentRow: (currentRow) => set({ currentRow }),
  setOpen: (open) =>
    set((state) => ({ currentRow: open ? state.currentRow : null, open })),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))
