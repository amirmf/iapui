import type { ReactNode } from 'react'

import { Button, cn } from '@iap/ui'
import type { Column } from '@tanstack/react-table'

export type TableSortLabels = {
  ascending?: string
  descending?: string
  unsorted?: string
}

export function DataTableColumnHeader<TData, TValue>(props: {
  className?: string
  column: Column<TData, TValue>
  labels?: TableSortLabels
  title: ReactNode
}) {
  const { className, column, labels, title } = props
  const sorting = column.getIsSorted()

  if (!column.getCanSort()) {
    return <div className={cn('text-sm font-medium', className)}>{title}</div>
  }

  const nextLabel =
    sorting === 'asc'
      ? (labels?.descending ?? 'Sort descending')
      : sorting === 'desc'
        ? (labels?.unsorted ?? 'Clear sorting')
        : (labels?.ascending ?? 'Sort ascending')

  return (
    <Button
      aria-label={nextLabel}
      className={cn('h-9 px-2 text-start', className)}
      onClick={() =>
        sorting === 'desc'
          ? column.clearSorting()
          : column.toggleSorting(sorting !== 'asc')
      }
      size='sm'
      variant='ghost'
    >
      <span>{title}</span>
      <span aria-hidden='true'>
        {sorting === 'asc' ? '↑' : sorting === 'desc' ? '↓' : '↕'}
      </span>
    </Button>
  )
}
