import type { ReactNode } from 'react'

import { Button, cn } from '@iap/ui'
import { ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons'
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

  return (
    <section
      className={cn(presentation !== 'reference' && 'space-y-3', className)}
    >
      {children}
      <div
        className={cn(
          presentation === 'reference'
            ? 'my-4 flex gap-2'
            : 'flex items-center gap-2',
          hasMoreFilters ? 'justify-between' : 'justify-end'
        )}
      >
        {hasMoreFilters ? (
          <Button
            presentation={presentation}
            aria-expanded={expanded}
            className={
              presentation === 'reference'
                ? 'h-8 px-2 hover:bg-gray-200 lg:px-2.5'
                : undefined
            }
            onClick={onExpandChange}
            size='sm'
            variant='ghost'
          >
            {expanded ? collapseLabel : expandLabel}
            {presentation === 'reference' ? (
              <ChevronDownIcon
                aria-hidden='true'
                className={cn(
                  'ml-1 size-4 transition-transform',
                  expanded && 'rotate-180'
                )}
              />
            ) : (
              <ChevronDown
                aria-hidden='true'
                className={cn(
                  'ms-1 size-4 transition-transform',
                  expanded && 'rotate-180'
                )}
              />
            )}
          </Button>
        ) : null}
        {isFiltered ? (
          <Button
            presentation={presentation}
            className={
              presentation === 'reference'
                ? 'h-7 px-2 has-[>svg]:px-2 lg:px-2.5'
                : undefined
            }
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
