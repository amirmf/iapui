import { useMemo, useState } from 'react'

import type { OtpListRequest, PagePasswordResetOtpList } from '@iap/api-types'
import { Button, cn } from '@iap/ui'
import { PaginatedDataTable, useTableFilterState } from '@shared/tables'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { otpService } from '../services/otp-service'
import OptDataTableToolbar from './opt-data-table-toolbar'
import { usePasswordResetOtpColumns } from './password-reset-otp-columns'

export default function PasswordResetOtpSection() {
  const { t } = useTranslation()
  const columns = usePasswordResetOtpColumns()
  const { pagination, setPagination, filters, onChange, reset } =
    useTableFilterState()
  const [sorting, setSorting] = useState<SortingState>([])
  const activeSort = sorting[0]
  const sort = activeSort?.id
  const direction = activeSort ? (activeSort.desc ? 'DESC' : 'ASC') : undefined

  const {
    data: pageData,
    isLoading,
    refetch,
  } = useQuery<PagePasswordResetOtpList>({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      otpService.listPasswordResetOtps({
        direction,
        filters: filters as OtpListRequest['filters'],
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
        sort,
      }),
    queryKey: ['password-reset-otps', pagination, filters, sort, direction],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  const rows = useMemo(() => pageData?.content ?? [], [pageData?.content])
  const pageCount = pageData?.totalPages ?? 0
  const totalCount = pageData?.totalElements ?? 0

  return (
    <section className='mt-10'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('otp.sections.passwordResetOtp')}
        </h2>
        <Button
          className='space-x-2'
          disabled={isLoading}
          onClick={() => refetch()}
          variant='outline'
        >
          <IconRefresh
            aria-hidden='true'
            className={cn(isLoading && 'animate-spin')}
            size={18}
          />
          <span>{t('common.refresh')}</span>
        </Button>
      </div>

      <div className='-mx-4 overflow-auto px-4 py-1'>
        <OptDataTableToolbar
          filters={filters}
          onChange={onChange}
          onReset={reset}
        />
        <PaginatedDataTable
          columns={columns}
          data={rows}
          emptyStateText={t('otp.empty.passwordResetOtp')}
          enableSorting
          isLoading={isLoading}
          manualFiltering
          manualSorting
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          pageCount={pageCount}
          pagination={pagination}
          sorting={sorting}
          tableWrapperClassName='max-h-90'
          totalCount={totalCount}
        />
      </div>
    </section>
  )
}
