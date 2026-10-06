import { type ReactNode, useEffect } from 'react'

import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'

export default function AssessmentPromptProvider(props: {
  children: ReactNode
}) {
  const { children } = props
  const reset = useAssessmentPrompt((state) => state.reset)

  useEffect(() => () => reset(), [reset])

  return <>{children}</>
}
