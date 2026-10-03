import type {
  RepetitiveResponse,
  RepetitiveResponseGroup,
} from '@iap/api-types'
import type { RowSelectionState, Updater } from '@tanstack/react-table'
import { create } from 'zustand'

export type RepetitiveResponseDialog =
  'create' | 'deleteMethod' | 'edit' | 'view' | null

type RepetitiveResponseStore = {
  currentGroupRow: RepetitiveResponseGroup | null
  currentResponseRow: RepetitiveResponse | null
  groupOpen: RepetitiveResponseDialog
  groupRowSelection: RowSelectionState
  reset: () => void
  responseOpen: RepetitiveResponseDialog
  setCurrentGroupRow: (row: RepetitiveResponseGroup | null) => void
  setCurrentResponseRow: (row: RepetitiveResponse | null) => void
  setGroupOpen: (dialog: RepetitiveResponseDialog) => void
  setGroupRowSelection: (updater: Updater<RowSelectionState>) => void
  setResponseOpen: (dialog: RepetitiveResponseDialog) => void
}

const resolveUpdater = (
  updater: Updater<RowSelectionState>,
  previous: RowSelectionState
) => (typeof updater === 'function' ? updater(previous) : updater)

export const useRepetitiveResponseStore = create<RepetitiveResponseStore>(
  (set) => ({
    currentGroupRow: null,
    currentResponseRow: null,
    groupOpen: null,
    groupRowSelection: {},
    reset: () =>
      set({
        currentGroupRow: null,
        currentResponseRow: null,
        groupOpen: null,
        groupRowSelection: {},
        responseOpen: null,
      }),
    responseOpen: null,
    setCurrentGroupRow: (currentGroupRow) => set({ currentGroupRow }),
    setCurrentResponseRow: (currentResponseRow) => set({ currentResponseRow }),
    setGroupOpen: (groupOpen) =>
      set((state) => ({
        currentGroupRow: groupOpen ? state.currentGroupRow : null,
        groupOpen,
        groupRowSelection: groupOpen ? state.groupRowSelection : {},
      })),
    setGroupRowSelection: (updater) =>
      set((state) => ({
        groupRowSelection: resolveUpdater(updater, state.groupRowSelection),
      })),
    setResponseOpen: (responseOpen) =>
      set((state) => ({
        currentResponseRow: responseOpen ? state.currentResponseRow : null,
        responseOpen,
      })),
  })
)

export const useRepetitiveResponse = () => ({
  currentRow: useRepetitiveResponseStore((state) => state.currentResponseRow),
  open: useRepetitiveResponseStore((state) => state.responseOpen),
  setCurrentRow: useRepetitiveResponseStore(
    (state) => state.setCurrentResponseRow
  ),
  setOpen: useRepetitiveResponseStore((state) => state.setResponseOpen),
})

export const useRepetitiveResponseGroup = () => ({
  currentRow: useRepetitiveResponseStore((state) => state.currentGroupRow),
  open: useRepetitiveResponseStore((state) => state.groupOpen),
  rowSelection: useRepetitiveResponseStore((state) => state.groupRowSelection),
  setCurrentRow: useRepetitiveResponseStore(
    (state) => state.setCurrentGroupRow
  ),
  setOpen: useRepetitiveResponseStore((state) => state.setGroupOpen),
  setRowSelection: useRepetitiveResponseStore(
    (state) => state.setGroupRowSelection
  ),
})
