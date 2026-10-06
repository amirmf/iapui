import { type ReactNode, useState } from 'react'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ReferenceIcons,
  cn,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
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
  presentation?: 'default' | 'reference'
}) {
  const { className, column, labels, title, presentation = 'default' } = props
  const { t } = useTranslate()
  const [open, setOpen] = useState(false)
  const sorting = column.getIsSorted()

  if (!column.getCanSort()) {
    return (
      <div
        className={cn(
          'flex h-8 items-center text-sm',
          presentation === 'reference' && 'rtl:text-right',
          presentation !== 'reference' && 'font-medium',
          className
        )}
      >
        {title}
      </div>
    )
  }

  if (presentation === 'reference') {
    const { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } =
      ReferenceIcons
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='h-8 !px-1 data-[state=open]:bg-accent'
              size='sm'
              variant='ghost'
            >
              <span>{title}</span>
              {sorting === 'desc' ? (
                <ArrowDownIcon className='h-4 w-4' />
              ) : sorting === 'asc' ? (
                <ArrowUpIcon className='h-4 w-4' />
              ) : (
                <CaretSortIcon className='h-4 w-4' />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
              <ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
              {t('common.asc')}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
              <ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
              {t('common.desc')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => column.clearSorting()}>
              <EyeNoneIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
              {t('common.reset')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
