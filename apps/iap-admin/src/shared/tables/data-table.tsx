import type { ReactNode } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@iap/ui'
import {
  type Cell,
  type Row,
  type Table as TanStackTable,
  flexRender,
} from '@tanstack/react-table'

export type DataTableRowLayout = 'table' | 'two-column'

export type DataTableLabels = {
  empty?: ReactNode
  noResults?: ReactNode
  loading?: ReactNode
}

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
            <div key={cell.id} className='min-w-0'>
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

export function DataTable<TData>(props: {
  caption?: ReactNode
  className?: string
  emptyContent?: ReactNode
  hasActiveFilters?: boolean
  isLoading?: boolean
  labels?: DataTableLabels
  noResultsContent?: ReactNode
  renderToolbar?: (table: TanStackTable<TData>) => ReactNode
  rowLayout?: DataTableRowLayout
  table: TanStackTable<TData>
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
    renderToolbar,
    rowLayout = 'table',
    table,
    twoColumnLabel = defaultTwoColumnLabel,
  } = props
  const rows = table.getRowModel().rows
  const visibleColumnCount = Math.max(table.getVisibleFlatColumns().length, 1)
  const statusContent = hasActiveFilters
    ? (noResultsContent ?? labels?.noResults ?? 'No matching records.')
    : (emptyContent ?? labels?.empty ?? 'No records found.')

  return (
    <section className={cn('space-y-4', className)}>
      {renderToolbar?.(table)}
      <div className='overflow-hidden rounded-xl border border-border bg-card'>
        <Table aria-busy={isLoading}>
          {caption ? (
            <TableCaption className='sr-only'>{caption}</TableCaption>
          ) : null}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorting = header.column.getIsSorted()
                  const sortable = header.column.getCanSort()

                  return (
                    <TableHead
                      aria-sort={
                        sortable
                          ? sorting === 'asc'
                            ? 'ascending'
                            : sorting === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                      className={header.column.columnDef.meta?.headerClassName}
                      colSpan={header.colSpan}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody aria-live='polite'>
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
              rows.map((row) =>
                rowLayout === 'two-column' ? (
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
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
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
