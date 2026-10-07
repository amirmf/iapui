import { type ReactNode, useEffect } from 'react'

import { useAssessmentItemStore } from '@features/assessment-items/context/store/assessment-item-store'

interface Props {
  children: ReactNode
}

export default function AssessmentItemProvider(props: Props) {
  const { children } = props
  const reset = useAssessmentItemStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}
