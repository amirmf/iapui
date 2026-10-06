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
  presentation?: 'default' | 'reference'
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
    presentation = 'default',
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
          presentation === 'reference'
            ? 'relative flex max-h-[480px] flex-col overflow-hidden rounded-md border'
            : 'relative overflow-x-auto rounded-xl border border-border bg-card',
          tableWrapperClassName
        )}
      >
        <Table>
          {caption ? (
            <TableCaption className='sr-only'>{caption}</TableCaption>
          ) : null}
          <TableHeader
            className={cn(
              'sticky top-0',
              presentation === 'reference'
                ? 'z-20 bg-background'
                : 'z-10 bg-card'
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={
                  presentation === 'reference' ? 'group/row' : undefined
                }
              >
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
                      className={cn(
                        presentation === 'reference' &&
                          'h-10 px-2 text-left text-sm font-medium text-foreground',
                        header.column.columnDef.meta?.className ??
                          header.column.columnDef.meta?.headerClassName
                      )}
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
          <TableBody
            aria-live='polite'
            className={cn(
              presentation === 'reference' && 'overflow-auto',
              tableBodyClassName
            )}
          >
            {children}
          </TableBody>
        </Table>
      </div>
      {renderPagination?.(table)}
    </section>
  )
}
