import { type ReactNode, useEffect } from 'react'

import { useSupportQuestionStore } from '../store/support-question-store'

export function SupportQuestionProvider({ children }: { children: ReactNode }) {
  const reset = useSupportQuestionStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}

export default SupportQuestionProvider
