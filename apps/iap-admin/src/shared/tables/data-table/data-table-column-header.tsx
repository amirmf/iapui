import { type ReactNode, useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@iap/ui'
import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, RotateCcw } from 'lucide-react'

export type TableSortLabels = {
  ascending?: string
  descending?: string
  reset?: string
  unsorted?: string
}

export function DataTableColumnHeader<TData, TValue>(props: {
  className?: string
  column: Column<TData, TValue>
  labels?: TableSortLabels
  title: ReactNode
}) {
  const { className, column, labels, title } = props
  const [open, setOpen] = useState(false)
  const sorting = column.getIsSorted()

  if (!column.getCanSort()) {
    return (
      <div
        className={cn('flex h-8 items-center text-sm font-medium', className)}
      >
        {title}
      </div>
    )
  }

  const icon =
    sorting === 'asc' ? (
      <ArrowUp aria-hidden='true' className='size-4' />
    ) : sorting === 'desc' ? (
      <ArrowDown aria-hidden='true' className='size-4' />
    ) : (
      <ChevronsUpDown aria-hidden='true' className='size-4' />
    )

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-label={typeof title === 'string' ? title : undefined}
          className={cn('h-8 px-1.5 text-start', className)}
          size='sm'
          variant='ghost'
        >
          <span>{title}</span>
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-48 p-1'>
        <Button
          className='w-full justify-start'
          onClick={() => {
            column.toggleSorting(false)
            setOpen(false)
          }}
          size='sm'
          variant='ghost'
        >
          <ArrowUp aria-hidden='true' className='size-4' />
          {labels?.ascending ?? 'Asc'}
        </Button>
        <Button
          className='w-full justify-start'
          onClick={() => {
            column.toggleSorting(true)
            setOpen(false)
          }}
          size='sm'
          variant='ghost'
        >
          <ArrowDown aria-hidden='true' className='size-4' />
          {labels?.descending ?? 'Desc'}
        </Button>
        <div className='my-1 h-px bg-border' />
        <Button
          className='w-full justify-start'
          onClick={() => {
            column.clearSorting()
            setOpen(false)
          }}
          size='sm'
          variant='ghost'
        >
          <RotateCcw aria-hidden='true' className='size-4' />
          {labels?.reset ?? labels?.unsorted ?? 'Reset'}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
