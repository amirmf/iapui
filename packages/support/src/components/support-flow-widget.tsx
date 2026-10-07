import { useEffect, useMemo } from 'react'

import { useLocation } from '@tanstack/react-router'

import { getSupportFlowRouteContext } from '../route-adapters/support-route-context'
import { SupportFloatingButton } from './support-floating-button'
import type { SupportFlowColorContext } from './support-flow-types'
import { SupportFlowWindow } from './support-flow-window'
import { useSupportFlow } from './support-flow-window/use-support-flow'

type SupportFlowWidgetProps = {
  colorContext?: SupportFlowColorContext
  position?: 'default' | 'admin'
}

export function SupportFlowWidget(props: SupportFlowWidgetProps) {
  const { colorContext = 'default', position = 'default' } = props
  const { hasInitialQuestions, isOpen, resetFlow } = useSupportFlow()
  const pathname = useLocation({ select: (location) => location.pathname })
  const context = useMemo(
    () => getSupportFlowRouteContext(pathname),
    [pathname]
  )

  useEffect(() => {
    resetFlow(context)
  }, [context, resetFlow])

  if (!hasInitialQuestions && !isOpen) return null

  return (
    <>
      <SupportFloatingButton
        colorContext={colorContext}
        position={position}
        context={context}
      />
      <SupportFlowWindow colorContext={colorContext} />
    </>
  )
}
