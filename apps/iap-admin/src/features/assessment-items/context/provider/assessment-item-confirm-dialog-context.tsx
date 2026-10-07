import { type ReactNode, useEffect } from 'react'

import { useAssessmentItemConfirmDialogStore } from '@features/assessment-items/context/store/assessment-item-confirm-dialog-store'

export type { AssessmentItemConfirmDialogType } from '@features/assessment-items/context/store/assessment-item-confirm-dialog-store'
interface Props {
  children: ReactNode
}

export default function AssessmentItemConfirmDialogProvider(props: Props) {
  const { children } = props
  const reset = useAssessmentItemConfirmDialogStore((state) => state.reset)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return <>{children}</>
}
