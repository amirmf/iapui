import type { ReactNode } from 'react'

import { cn } from '@iap/ui'

export function TwoLineCell(props: {
  primary: ReactNode
  primaryClassName?: string
  secondary?: ReactNode
  secondaryClassName?: string
  truncate?: boolean
}) {
  const {
    primary,
    primaryClassName,
    secondary = '–',
    secondaryClassName,
    truncate = true,
  } = props

  return (
    <div className='flex min-w-0 flex-col gap-1'>
      <div
        className={cn('font-medium', truncate && 'truncate', primaryClassName)}
      >
        {primary ?? '–'}
      </div>
      <div
        className={cn(
          'text-xs text-muted-foreground',
          truncate && 'truncate',
          secondaryClassName
        )}
      >
        {secondary}
      </div>
    </div>
  )
}
