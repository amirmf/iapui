import { type ReactNode, useEffect } from 'react'

import { useAiAssessmentRuleAutomationLevelsTableStore } from '../store/ai-assessment-rule-automation-levels-table-store'
import { useAiAssessmentRuleDetailsTableStore } from '../store/ai-assessment-rule-details-table-store'
import { useAiAssessmentRuleStore } from '../store/ai-assessment-rule-store'

export default function AiAssessmentRuleProvider({
  children,
}: {
  children: ReactNode
}) {
  const resetMain = useAiAssessmentRuleStore((state) => state.reset)
  const resetDetails = useAiAssessmentRuleDetailsTableStore(
    (state) => state.reset
  )
  const resetAutomationLevels = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.reset
  )

  useEffect(
    () => () => {
      resetMain()
      resetDetails()
      resetAutomationLevels()
    },
    [resetMain, resetDetails, resetAutomationLevels]
  )

  return <>{children}</>
}
