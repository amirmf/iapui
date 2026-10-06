import { Button, Select, cn } from '@iap/ui'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const PAGE_SIZES = [10, 20, 30, 40, 50, 100].map((value) => ({
  value,
  label: String(value),
}))

export function ReferencePaginationControls<TData>(props: {
  hasCheckboxes: boolean
  smallPagination: boolean
  table: Table<TData>
  totalCount?: number
}) {
  const { hasCheckboxes, smallPagination, table, totalCount = 0 } = props
  const { t } = useTranslation()
  const { pageIndex, pageSize } = table.getState().pagination
  return (
    <nav
      className='flex flex-wrap items-center justify-between overflow-clip px-2'
      style={{ overflowClipMargin: 1 }}
    >
      {hasCheckboxes ? (
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
      ) : null}
      <div
        className={cn(
          'hidden flex-1 text-sm text-muted-foreground sm:block',
          smallPagination && 'sm:hidden'
        )}
      >
        {`${t('dataTable.total')}: ${totalCount || '-'}`}
      </div>
      <div
        className={cn(
          'flex flex-wrap items-center',
          smallPagination
            ? 'flex-1 justify-between py-2'
            : 'sm:gap-x-6 lg:gap-x-8'
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
            presentation='reference'
            className='w-[70px]'
            labelKey='label'
            onValueChange={(option) =>
              option && table.setPageSize(option.value)
            }
            options={PAGE_SIZES}
            placeholder={String(pageSize)}
            triggerClassName='h-8 min-h-0 rounded-md px-3 py-0'
            value={PAGE_SIZES.find((option) => option.value === pageSize)}
            valueKey='value'
          />
        </div>
        <div className='flex w-[120px] items-center justify-center text-sm font-medium'>
          {t('dataTable.pageIndicator', {
            page: pageIndex + 1,
            pageCount: table.getPageCount(),
          })}
        </div>
        <div className='flex items-center gap-x-2'>
          <Button
            presentation='reference'
            aria-label='Go to first page'
            className='hidden h-8 w-8 p-0 lg:flex'
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            variant='outline'
          >
            <DoubleArrowLeftIcon
              aria-hidden='true'
              className='size-4 rtl:rotate-180'
            />
          </Button>
          <Button
            presentation='reference'
            aria-label='Go to previous page'
            className='h-8 w-8 p-0'
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            variant='outline'
          >
            <ChevronLeftIcon
              aria-hidden='true'
              className='size-4 rtl:rotate-180'
            />
          </Button>
          <Button
            presentation='reference'
            aria-label='Go to next page'
            className='h-8 w-8 p-0'
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            variant='outline'
          >
            <ChevronRightIcon
              aria-hidden='true'
              className='size-4 rtl:rotate-180'
            />
          </Button>
          <Button
            presentation='reference'
            aria-label='Go to last page'
            className='hidden h-8 w-8 p-0 lg:flex'
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            variant='outline'
          >
            <DoubleArrowRightIcon
              aria-hidden='true'
              className='size-4 rtl:rotate-180'
            />
          </Button>
        </div>
      </div>
    </nav>
  )
}
