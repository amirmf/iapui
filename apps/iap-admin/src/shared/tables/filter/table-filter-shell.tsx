import type { ReactNode } from 'react'

import { Button, ReferenceIcons, cn } from '@iap/ui'
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
  presentation?: 'default' | 'reference'
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
    presentation = 'default',
  } = props
  const { Cross2Icon } = ReferenceIcons

  return (
    <section
      className={cn(presentation !== 'reference' && 'space-y-3', className)}
    >
      {children}
      <div
        className={cn(
          'flex items-center gap-2',
          hasMoreFilters && 'justify-between',
          !hasMoreFilters && 'justify-end',
          presentation === 'reference' && 'my-4'
        )}
      >
        {hasMoreFilters ? (
          <Button
            aria-expanded={expanded}
            onClick={onExpandChange}
            size='sm'
            variant='ghost'
          >
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
          <Button
            className={cn(presentation === 'reference' && 'h-7 px-2 lg:px-2.5')}
            onClick={onReset}
            size='sm'
            variant={presentation === 'reference' ? 'secondary' : 'outline'}
          >
            {presentation === 'reference' ? (
              <Cross2Icon aria-hidden='true' className='me-2 size-4' />
            ) : (
              <RotateCcw aria-hidden='true' className='me-1 size-4' />
            )}
            {resetLabel}
          </Button>
        ) : null}
      </div>
    </section>
  )
}
