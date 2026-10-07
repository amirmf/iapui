import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

type TicketSheet = 'detail'

type TicketState = {
  currentTicketId: string | null
  open: TicketSheet | null
  reset: () => void
  rowSelection: RowSelectionState
  setCurrentTicketId: (currentTicketId: string | null) => void
  setOpen: (open: TicketSheet | null) => void
  setRowSelection: (updater: Updater<RowSelectionState>) => void
}

export const useTicketStore = create<TicketState>((set) => ({
  currentTicketId: null,
  open: null,
  reset: () => set({ currentTicketId: null, open: null, rowSelection: {} }),
  rowSelection: {},
  setCurrentTicketId: (currentTicketId) => set({ currentTicketId }),
  setOpen: (open) =>
    set((state) => ({
      currentTicketId: open ? state.currentTicketId : null,
      open,
    })),
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),
}))
