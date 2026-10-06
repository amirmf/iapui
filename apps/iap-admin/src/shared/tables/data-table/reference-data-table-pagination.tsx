import { ReferenceIcons } from '@iap/ui'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import {
  RadixSelect as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import type { Table } from '@tanstack/react-table'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  hasCheckboxes?: boolean
  smallPagination?: boolean
  totalCount?: number
}

export function ReferenceDataTablePagination<TData>(
  props: DataTablePaginationProps<TData>
) {
  const {
    table,
    hasCheckboxes,
    smallPagination = false,
    totalCount = 0,
  } = props
  const {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
  } = ReferenceIcons
  const { t } = useTranslate()
  return (
    <div
      className='flex flex-wrap items-center justify-between overflow-clip px-2'
      style={{ overflowClipMargin: 1 }}
    >
      {hasCheckboxes && (
        <div
          className={cn(
            'hidden flex-1 text-sm text-muted-foreground sm:block',
            smallPagination && 'sm:hidden'
          )}
        >
          {t('dataTable.rowsSelected', {
            selected: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
      )}
      {totalCount != null && (
        <div
          className={cn(
            'hidden flex-1 text-sm text-muted-foreground sm:block',
            smallPagination && 'sm:hidden'
          )}
        >
          {`${t('dataTable.total')}: ${totalCount || '-'}`}
        </div>
      )}
      <div
        className={cn(
          'flex flex-wrap items-center',
          smallPagination && 'flex-1 justify-between py-2',
          !smallPagination && 'sm:gap-x-6 lg:gap-x-8'
        )}
      >
        <div className='flex items-center gap-x-2'>
          <p
            className={cn(
              'hidden text-sm font-medium sm:block',
              smallPagination && 'sm:hidden'
            )}
          >
            {t('dataTable.rowsPerPage')}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[120px] items-center justify-center text-sm font-medium'>
          {t('dataTable.pageIndicator', {
            page: table.getState().pagination.pageIndex + 1,
            pageCount: table.getPageCount(),
          })}
        </div>
        <div className='flex items-center gap-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4 rtl:rotate-180' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4 rtl:rotate-180' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4 rtl:rotate-180' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4 rtl:rotate-180' />
          </Button>
        </div>
      </div>
    </div>
  )
}
