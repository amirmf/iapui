import type { ReactNode } from 'react'

import { LongText, cn } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables/data-table/data-table-column-header'
import type { Column } from '@tanstack/react-table'

export function TwoLineHeader<TData, TValue>(props: {
  column: Column<TData, TValue>
  primary: ReactNode
  secondary?: ReactNode
}) {
  const { column, primary, secondary } = props

  return (
    <div className='flex flex-col gap-1 text-sm'>
      <DataTableColumnHeader column={column} title={primary} />
      {secondary ? (
        <div className='text-xs font-normal text-muted-foreground'>
          <DataTableColumnHeader column={column} title={secondary} />
        </div>
      ) : null}
    </div>
  )
}

export function TwoLineCell(props: {
  primary: ReactNode
  primaryClassName?: string
  longText?: boolean
  longTextPrimary?: boolean
  longTextSecondary?: boolean
  secondary?: ReactNode
  secondaryClassName?: string
  truncate?: boolean
}) {
  const {
    primary,
    primaryClassName,
    longText = false,
    longTextPrimary = false,
    longTextSecondary = false,
    secondary = '–',
    secondaryClassName,
    truncate = true,
  } = props

  return (
    <div className='flex min-w-0 flex-col gap-1 text-sm'>
      {longText || longTextPrimary ? (
        <LongText className={cn('font-medium', primaryClassName)}>
          {primary ?? '–'}
        </LongText>
      ) : (
        <div
          className={cn(
            'font-medium',
            truncate && 'truncate',
            primaryClassName
          )}
        >
          {primary ?? '–'}
        </div>
      )}
      <div
        className={cn(
          'text-xs text-muted-foreground',
          !longText && !longTextSecondary && truncate && 'truncate'
        )}
      >
        {longText || longTextSecondary ? (
          <LongText className={secondaryClassName}>{secondary}</LongText>
        ) : (
          <div className={secondaryClassName}>{secondary}</div>
        )}
      </div>
    </div>
  )
}

export function TwoLineCellWrapper(props: {
  children: [ReactNode, ReactNode]
  primaryClassName?: string
  secondaryClassName?: string
}) {
  const { children, primaryClassName, secondaryClassName } = props
  const [primary, secondary] = children

  return (
    <div className='flex min-w-0 flex-col gap-1 text-sm'>
      <div className={cn('truncate font-medium', primaryClassName)}>
        {primary}
      </div>
      <div
        className={cn(
          'truncate text-xs font-normal text-muted-foreground',
          secondaryClassName
        )}
      >
        {secondary}
      </div>
    </div>
  )
}
