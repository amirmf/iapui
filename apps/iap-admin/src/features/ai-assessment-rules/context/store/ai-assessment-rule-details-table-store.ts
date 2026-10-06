import type { AiAssessmentRuleDetail } from '@iap/api-types'
import { create } from 'zustand'

export type AiAssessmentRuleDetailDialogType = 'create' | 'delete' | 'edit'

export interface AiAssessmentRuleDetailsTableState {
  currentDetail: AiAssessmentRuleDetail | null
  open: AiAssessmentRuleDetailDialogType | null
  reset: () => void
  setCurrentDetail: (detail: AiAssessmentRuleDetail | null) => void
  setOpen: (open: AiAssessmentRuleDetailDialogType | null) => void
}

const initialState = {
  currentDetail: null,
  open: null,
} satisfies Pick<AiAssessmentRuleDetailsTableState, 'currentDetail' | 'open'>

export const useAiAssessmentRuleDetailsTableStore =
  create<AiAssessmentRuleDetailsTableState>((set) => ({
    ...initialState,
    reset: () => set(initialState),
    setCurrentDetail: (currentDetail) => set({ currentDetail }),
    setOpen: (open) =>
      set(open === null ? { currentDetail: null, open } : { open }),
  }))
