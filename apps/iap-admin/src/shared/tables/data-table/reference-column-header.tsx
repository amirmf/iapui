import type { ReactNode } from 'react'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from '@iap/ui'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons'
import type { Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function ReferenceColumnHeader<TData, TValue>(props: {
  className?: string
  column: Column<TData, TValue>
  title: ReactNode
}) {
  const { className, column, title } = props
  const { t } = useTranslation()
  if (!column.getCanSort())
    return (
      <div
        className={cn(
          'flex h-8 items-center text-sm rtl:text-right',
          className
        )}
      >
        {title}
      </div>
    )
  const sorting = column.getIsSorted()
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            presentation='reference'
            className='h-8 !px-1 data-[state=open]:bg-accent'
            size='sm'
            variant='ghost'
          >
            <span>{title}</span>
            {sorting === 'desc' ? (
              <ArrowDownIcon className='size-4' />
            ) : sorting === 'asc' ? (
              <ArrowUpIcon className='size-4' />
            ) : (
              <CaretSortIcon className='size-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='rounded-md shadow-md'>
          <DropdownMenuItem
            className='min-h-0 rounded-sm focus:bg-accent focus:text-accent-foreground'
            onSelect={() => column.toggleSorting(false)}
          >
            <ArrowUpIcon className='mr-2 size-3.5 text-muted-foreground/70' />
            {t('common.asc', { defaultValue: 'Asc' })}
          </DropdownMenuItem>
          <DropdownMenuItem
            className='min-h-0 rounded-sm focus:bg-accent focus:text-accent-foreground'
            onSelect={() => column.toggleSorting(true)}
          >
            <ArrowDownIcon className='mr-2 size-3.5 text-muted-foreground/70' />
            {t('common.desc', { defaultValue: 'Desc' })}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='min-h-0 rounded-sm focus:bg-accent focus:text-accent-foreground'
            onSelect={() => column.clearSorting()}
          >
            <EyeNoneIcon className='mr-2 size-3.5 text-muted-foreground/70' />
            {t('common.reset', { defaultValue: 'Reset' })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
