import type { ReactNode } from 'react'

import { TableCell, TableRow } from '@iap/ui'
import { DataTableLayout } from '@shared/tables/data-table/data-table-layout'
import type {
  DataTableLabels,
  DataTableRowLayout,
} from '@shared/tables/data-table/types'
import {
  type Cell,
  type Row,
  type Table as TanStackTable,
  flexRender,
} from '@tanstack/react-table'

function defaultTwoColumnLabel<TData>(cell: Cell<TData, unknown>) {
  const { column } = cell

  return (
    column.columnDef.meta?.label ??
    (typeof column.columnDef.header === 'string'
      ? column.columnDef.header
      : column.id)
  )
}

function TwoColumnRow<TData>(props: {
  label: (cell: Cell<TData, unknown>) => ReactNode
  row: Row<TData>
}) {
  const { label, row } = props
  const cells = row.getVisibleCells()

  return (
    <TableRow>
      <TableCell colSpan={cells.length}>
        <dl className='grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2'>
          {cells.map((cell) => (
            <div className='min-w-0' key={cell.id}>
              <dt className='mb-1 text-xs font-medium text-muted-foreground'>
                {label(cell)}
              </dt>
              <dd className='min-w-0 text-sm'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </dd>
            </div>
          ))}
        </dl>
      </TableCell>
    </TableRow>
  )
}

export function SimpleDataTable<TData>(props: {
  caption?: ReactNode
  className?: string
  emptyContent?: ReactNode
  hasActiveFilters?: boolean
  isLoading?: boolean
  labels?: DataTableLabels
  noResultsContent?: ReactNode
  renderPagination?: (table: TanStackTable<TData>) => ReactNode
  renderRow?: (row: Row<TData>) => ReactNode
  renderToolbar?: (table: TanStackTable<TData>) => ReactNode
  rowLayout?: DataTableRowLayout
  table: TanStackTable<TData>
  tableBodyClassName?: string
  tableWrapperClassName?: string
  twoColumnLabel?: (cell: Cell<TData, unknown>) => ReactNode
}) {
  const {
    caption,
    className,
    emptyContent,
    hasActiveFilters = false,
    isLoading = false,
    labels,
    noResultsContent,
    renderPagination,
    renderRow,
    renderToolbar,
    rowLayout = 'table',
    table,
    tableBodyClassName,
    tableWrapperClassName,
    twoColumnLabel = defaultTwoColumnLabel,
  } = props
  const rows = table.getRowModel().rows
  const visibleColumnCount = Math.max(table.getVisibleFlatColumns().length, 1)
  const statusContent = hasActiveFilters
    ? (noResultsContent ?? labels?.noResults ?? 'No matching records.')
    : (emptyContent ?? labels?.empty ?? 'No records found.')

  return (
    <DataTableLayout
      caption={caption}
      className={className}
      renderPagination={renderPagination}
      renderToolbar={renderToolbar}
      table={table}
      tableBodyClassName={tableBodyClassName}
      tableWrapperClassName={tableWrapperClassName}
    >
      {isLoading ? (
        <TableRow>
          <TableCell
            className='h-28 text-center text-muted-foreground'
            colSpan={visibleColumnCount}
          >
            {labels?.loading ?? 'Loading…'}
          </TableCell>
        </TableRow>
      ) : rows.length ? (
        rows.map(
          (row) =>
            renderRow?.(row) ??
            (rowLayout === 'two-column' ? (
              <TwoColumnRow key={row.id} label={twoColumnLabel} row={row} />
            ) : (
              <TableRow
                data-state={row.getIsSelected() ? 'selected' : undefined}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className={cell.column.columnDef.meta?.cellClassName}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
        )
      ) : (
        <TableRow>
          <TableCell
            className='h-28 text-center text-muted-foreground'
            colSpan={visibleColumnCount}
          >
            {statusContent}
          </TableCell>
        </TableRow>
      )}
    </DataTableLayout>
  )
}
