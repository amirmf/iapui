import { useEffect, useMemo } from 'react'

import type { SupportFlowContext } from '../model/support-flow-context'
import { SupportFloatingButton } from './support-floating-button'
import { SupportFlowWindow } from './support-flow-window'
import { useSupportFlow } from './support-flow-window/use-support-flow'

type SupportWidgetProps = {
  context: SupportFlowContext
  position?: 'default' | 'admin'
}
/** Compatibility entry for hosts that already provide their own page context. */
export function SupportWidget(props: SupportWidgetProps) {
  const { context, position = 'default' } = props
  const { isMyIap, isPublic, pageKey } = context
  const stableContext = useMemo(
    () => ({ isMyIap, isPublic, pageKey }),
    [isMyIap, isPublic, pageKey]
  )
  const { resetFlow, hasInitialQuestions, isOpen } = useSupportFlow()
  useEffect(() => {
    resetFlow(stableContext)
  }, [resetFlow, stableContext])
  if (!hasInitialQuestions && !isOpen) return null
  return (
    <>
      <SupportFloatingButton context={stableContext} position={position} />
      <SupportFlowWindow />
    </>
  )
}
