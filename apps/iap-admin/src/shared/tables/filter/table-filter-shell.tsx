import type { ReactNode } from 'react'

import { Button, cn } from '@iap/ui'
import { ChevronDown, RotateCcw } from 'lucide-react'

export function TableFilterShell(props: {
  children: ReactNode
  className?: string
  collapseLabel?: string
  expandLabel?: string
  expanded: boolean
  hasMoreFilters: boolean
  isFiltered: boolean
  onExpandChange: () => void
  onReset: () => void
  resetLabel?: string
}) {
  const {
    children,
    className,
    collapseLabel = 'Show less',
    expandLabel = 'Show more',
    expanded,
    hasMoreFilters,
    isFiltered,
    onExpandChange,
    onReset,
    resetLabel = 'Reset filters',
  } = props

  return (
    <section className={cn('space-y-3', className)}>
      {children}
      <div
        className={cn(
          'flex items-center gap-2',
          hasMoreFilters ? 'justify-between' : 'justify-end'
        )}
      >
        {hasMoreFilters ? (
          <Button onClick={onExpandChange} size='sm' variant='ghost'>
            {expanded ? collapseLabel : expandLabel}
            <ChevronDown
              aria-hidden='true'
              className={cn(
                'ms-1 size-4 transition-transform',
                expanded && 'rotate-180'
              )}
            />
          </Button>
        ) : null}
        {isFiltered ? (
          <Button onClick={onReset} size='sm' variant='outline'>
            <RotateCcw aria-hidden='true' className='me-1 size-4' />
            {resetLabel}
          </Button>
        ) : null}
      </div>
    </section>
  )
}
