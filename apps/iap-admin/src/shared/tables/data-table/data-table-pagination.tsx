import { Button, cn } from '@iap/ui'
import { ReferenceDataTablePagination } from '@shared/tables/data-table/reference-data-table-pagination'
import type { Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

export type DataTablePaginationLabels = {
  firstPage?: string
  lastPage?: string
  nextPage?: string
  pageSize?: string
  previousPage?: string
  selected?: (selected: number, total: number) => string
  status?: (page: number, pageCount: number) => string
  total?: (count: number) => string
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function DataTablePagination<TData>(props: {
  hasCheckboxes?: boolean
  labels?: DataTablePaginationLabels
  pageSizeOptions?: readonly number[]
  presentation?: 'default' | 'reference'
  smallPagination?: boolean
  table: Table<TData>
  totalCount?: number
}) {
  const {
    hasCheckboxes = false,
    labels,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    presentation = 'default',
    smallPagination = false,
    table,
    totalCount,
  } = props
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const rowCount = table.getFilteredRowModel().rows.length
  if (presentation === 'reference') {
    return (
      <ReferenceDataTablePagination
        table={table}
        hasCheckboxes={hasCheckboxes}
        smallPagination={smallPagination}
        totalCount={totalCount}
      />
    )
  }
  const status =
    labels?.status?.(pageIndex + 1, pageCount) ??
    `Page ${pageIndex + 1} of ${pageCount}`

  return (
    <nav
      aria-label={status}
      className='flex flex-wrap items-center justify-between gap-3'
    >
      <p
        className={cn(
          'text-sm text-muted-foreground',
          smallPagination && 'hidden sm:block'
        )}
      >
        {hasCheckboxes && selectedCount
          ? (labels?.selected?.(selectedCount, rowCount) ??
            `${selectedCount} of ${rowCount} selected`)
          : totalCount === undefined
            ? status
            : (labels?.total?.(totalCount) ?? `${totalCount} records`)}
      </p>
      <div className='flex flex-wrap items-center gap-2'>
        <label
          className={cn(
            'flex items-center gap-2 text-sm text-muted-foreground',
            smallPagination && 'sm:hidden'
          )}
        >
          <span>{labels?.pageSize ?? 'Rows per page'}</span>
          <select
            aria-label={labels?.pageSize ?? 'Rows per page'}
            className='h-9 rounded-lg border border-input bg-surface px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            value={pageSize}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <span className='text-sm font-medium'>{status}</span>
        <Button
          aria-label={labels?.firstPage ?? 'Go to first page'}
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
          size='sm'
          variant='outline'
        >
          <ChevronsLeft aria-hidden='true' className='size-4' />
        </Button>
        <Button
          aria-label={labels?.previousPage ?? 'Go to previous page'}
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size='sm'
          variant='outline'
        >
          <ChevronLeft aria-hidden='true' className='size-4' />
        </Button>
        <Button
          aria-label={labels?.nextPage ?? 'Go to next page'}
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size='sm'
          variant='outline'
        >
          <ChevronRight aria-hidden='true' className='size-4' />
        </Button>
        <Button
          aria-label={labels?.lastPage ?? 'Go to last page'}
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(Math.max(pageCount - 1, 0))}
          size='sm'
          variant='outline'
        >
          <ChevronsRight aria-hidden='true' className='size-4' />
        </Button>
      </div>
    </nav>
  )
}
