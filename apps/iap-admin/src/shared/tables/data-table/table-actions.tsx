import type { ReactNode } from 'react'

import { TooltipProvider, cn } from '@iap/ui'

export function TableActions(props: {
  children: ReactNode
  className?: string
}) {
  const { children, className } = props

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-1', className)}>{children}</div>
    </TooltipProvider>
  )
}
