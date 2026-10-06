import type { ReactNode } from 'react'

import { TooltipProvider, cn } from '@iap/ui'

export function TableActions(props: {
  children: ReactNode
  className?: string
  presentation?: 'default' | 'reference'
}) {
  const { children, className, presentation = 'default' } = props

  return (
    <TooltipProvider
      delayDuration={presentation === 'reference' ? 0 : undefined}
    >
      <div className={cn('flex items-center gap-1', className)}>{children}</div>
    </TooltipProvider>
  )
}
