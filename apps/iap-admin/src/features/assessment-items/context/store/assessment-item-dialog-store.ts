import { create } from 'zustand'

export type AssessmentItemDialogType = 'doctor-lookup' | 'pre-auth-inquiries'

interface AssessmentItemDialogState {
  activeDialog: AssessmentItemDialogType | null
  setActiveDialog: (dialog: AssessmentItemDialogType | null) => void
  reset: () => void
}

export const useAssessmentItemDialogStore = create<AssessmentItemDialogState>(
  (set) => ({
    activeDialog: null,
    setActiveDialog: (activeDialog) => set({ activeDialog }),
    reset: () => set({ activeDialog: null }),
  })
)

export const useAssessmentItemDialog = useAssessmentItemDialogStore
