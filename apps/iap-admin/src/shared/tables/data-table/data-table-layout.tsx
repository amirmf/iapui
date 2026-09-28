import type { ReactNode } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@iap/ui'
import { type Table as TanStackTable, flexRender } from '@tanstack/react-table'

export function DataTableLayout<TData>(props: {
  caption?: ReactNode
  children: ReactNode
  className?: string
  renderPagination?: (table: TanStackTable<TData>) => ReactNode
  renderToolbar?: (table: TanStackTable<TData>) => ReactNode
  table: TanStackTable<TData>
  tableBodyClassName?: string
  tableWrapperClassName?: string
}) {
  const {
    caption,
    children,
    className,
    renderPagination,
    renderToolbar,
    table,
    tableBodyClassName,
    tableWrapperClassName,
  } = props

  return (
    <section className={cn('space-y-4', className)}>
      {renderToolbar?.(table)}
      <div
        className={cn(
          'relative overflow-x-auto rounded-xl border border-border bg-card',
          tableWrapperClassName
        )}
      >
        <Table>
          {caption ? (
            <TableCaption className='sr-only'>{caption}</TableCaption>
          ) : null}
          <TableHeader className='sticky top-0 z-10 bg-card'>
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
                      className={
                        header.column.columnDef.meta?.className ??
                        header.column.columnDef.meta?.headerClassName
                      }
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
          <TableBody aria-live='polite' className={tableBodyClassName}>
            {children}
          </TableBody>
        </Table>
      </div>
      {renderPagination?.(table)}
    </section>
  )
}
