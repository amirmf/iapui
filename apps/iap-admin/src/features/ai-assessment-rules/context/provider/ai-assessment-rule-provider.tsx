import { type ReactNode, useEffect } from 'react'

import { useAiAssessmentRuleStore } from '../store/ai-assessment-rule-store'

export default function AiAssessmentRuleProvider({
  children,
}: {
  children: ReactNode
}) {
  const reset = useAiAssessmentRuleStore((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}
