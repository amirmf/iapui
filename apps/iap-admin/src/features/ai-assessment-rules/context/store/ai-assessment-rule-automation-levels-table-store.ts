import type { AiAssessmentRuleAutomationLevelItem } from '@iap/api-types'
import { create } from 'zustand'

export type AutomationLevelDialogType = 'create' | 'delete' | 'edit'

export interface AiAssessmentRuleAutomationLevelsTableState {
  currentAutomationLevel: AiAssessmentRuleAutomationLevelItem | null
  open: AutomationLevelDialogType | null
  reset: () => void
  setCurrentAutomationLevel: (
    automationLevel: AiAssessmentRuleAutomationLevelItem | null
  ) => void
  setOpen: (open: AutomationLevelDialogType | null) => void
}

const initialState = {
  currentAutomationLevel: null,
  open: null,
} satisfies Pick<
  AiAssessmentRuleAutomationLevelsTableState,
  'currentAutomationLevel' | 'open'
>

export const useAiAssessmentRuleAutomationLevelsTableStore =
  create<AiAssessmentRuleAutomationLevelsTableState>((set) => ({
    ...initialState,
    reset: () => set(initialState),
    setCurrentAutomationLevel: (currentAutomationLevel) =>
      set({ currentAutomationLevel }),
    setOpen: (open) =>
      set(open === null ? { currentAutomationLevel: null, open } : { open }),
  }))
