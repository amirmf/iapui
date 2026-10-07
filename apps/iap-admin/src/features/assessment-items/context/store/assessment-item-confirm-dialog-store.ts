import { create } from 'zustand'

export type AssessmentItemConfirmDialogType =
  'calculate' | 'max-coverage' | 'max-per-case'

type AssessmentItemConfirmDialogOpenState = Record<
  AssessmentItemConfirmDialogType,
  boolean
>

const initialOpenState: AssessmentItemConfirmDialogOpenState = {
  calculate: false,
  'max-coverage': false,
  'max-per-case': false,
}

interface AssessmentItemConfirmDialogState {
  open: AssessmentItemConfirmDialogOpenState
  openDialog: (dialog: AssessmentItemConfirmDialogType) => void
  setDialogOpen: (
    dialog: AssessmentItemConfirmDialogType,
    open: boolean
  ) => void
  reset: () => void
}

export const useAssessmentItemConfirmDialogStore =
  create<AssessmentItemConfirmDialogState>((set) => ({
    open: initialOpenState,
    openDialog: (dialog) =>
      set((state) => ({
        open: {
          ...state.open,
          [dialog]: true,
        },
      })),
    setDialogOpen: (dialog, open) =>
      set((state) => ({
        open: {
          ...state.open,
          [dialog]: open,
        },
      })),
    reset: () => set({ open: initialOpenState }),
  }))

export const useAssessmentItemConfirmDialog =
  useAssessmentItemConfirmDialogStore
