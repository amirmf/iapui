import { type ReactNode, useEffect } from 'react'

import { useAssessmentItemDialogStore } from '@features/assessment-items/context/store/assessment-item-dialog-store'

interface AssessmentItemDialogProviderProps {
  children: ReactNode
}

export default function AssessmentItemDialogProvider(
  props: AssessmentItemDialogProviderProps
) {
  const { children } = props
  const reset = useAssessmentItemDialogStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}
