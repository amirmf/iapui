import { Button } from '@iap/ui'
import type { Table } from '@tanstack/react-table'

export type DataTablePaginationLabels = {
  next?: string
  pageSize?: string
  previous?: string
  status?: (page: number, pageCount: number) => string
  total?: (count: number) => string
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function DataTablePagination<TData>(props: {
  labels?: DataTablePaginationLabels
  pageSizeOptions?: number[]
  table: Table<TData>
  totalCount?: number
}) {
  const {
    labels,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    table,
    totalCount,
  } = props
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <nav
      aria-label={labels?.status?.(pageIndex + 1, pageCount) ?? 'Pagination'}
      className='flex flex-wrap items-center justify-between gap-3'
    >
      <p className='text-sm text-muted-foreground'>
        {totalCount === undefined
          ? (labels?.status?.(pageIndex + 1, pageCount) ??
            `Page ${pageIndex + 1} of ${pageCount}`)
          : (labels?.total?.(totalCount) ?? `${totalCount} records`)}
      </p>
      <div className='flex flex-wrap items-center gap-2'>
        <label className='flex items-center gap-2 text-sm text-muted-foreground'>
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
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          size='sm'
          variant='outline'
        >
          {labels?.previous ?? 'Previous'}
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          size='sm'
          variant='outline'
        >
          {labels?.next ?? 'Next'}
        </Button>
      </div>
    </nav>
  )
}
