import { useMemo } from 'react'

import {
  ClaimRequestDataTableToolbar,
  applyClaimRequestQuickStatusFilter,
  claimRequestService,
} from '@features/claim-requests'
import { ignoreSkipCurrentUserFilter } from '@features/customer-user/model/customer-user-claim-constant'
import { useCustomerUserClaimRequestColumns } from '@features/customer-user/pages/claim-requests/components/customer-user-claim-request-columns'
import { CustomerUserClaimRequestHeaderActions } from '@features/customer-user/pages/claim-requests/components/customer-user-claim-request-header-actions'
import { useSyncQueryParamsTableFilter } from '@features/customer-user/pages/claim-requests/route-adapters/use-sync-query-params-table-filter'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

export function CustomerUserClaimRequestsPage() {
  const { t } = useTranslation()
  const columns = useCustomerUserClaimRequestColumns()
  const { setPagination, pagination, filters, sorting, onSortingChange } =
    useSyncQueryParamsTableFilter()

  const effectiveFilters = useMemo(
    () =>
      produce(filters, (draft) => {
        if (!draft.sort || draft.sort === '') {
          draft.sort = 'createdAt'
          draft.direction = 'asc'
        }

        const quickStatusFromFilters = draft['quickStatus'] as
          string | undefined
        const quickStatus = quickStatusFromFilters ?? 'IN_ASSESSMENT'

        if (!ignoreSkipCurrentUserFilter.includes(quickStatus)) {
          draft['skipCurrentUserFilter'] = 'Y'
        }
        if (quickStatus) {
          applyClaimRequestQuickStatusFilter(draft, quickStatus)
        }
      }),
    [filters]
  )

  const { data, isError, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['customerUserClaimRequests', pagination, effectiveFilters],
    queryFn: ({ signal }) =>
      claimRequestService.getPageLite({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        filters: effectiveFilters,
        signal,
      }),
  })
  const claimRequests = useMemo(() => data?.content ?? [], [data])

  return (
    <section className='pb-4'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-xl font-bold tracking-tight'>
          {t('customerUser.claimRequests.title')}
        </h1>
        <CustomerUserClaimRequestHeaderActions
          isLoading={isLoading || isFetching}
          onRefetch={refetch}
          filters={produce(filters, (draft) => {
            draft.page = pagination.pageIndex
            draft.size = pagination.pageSize
          })}
        />
      </div>
      {isError ? (
        <p className='text-destructive'>{t('common.errorStatus.generic')}</p>
      ) : null}
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <ClaimRequestDataTableToolbar
          count={data?.totalElements ?? undefined}
          isLoading={isLoading || isFetching}
        />
        <PaginatedDataTable
          columns={columns}
          data={claimRequests}
          isLoading={isLoading}
          pageCount={data?.totalPages ?? 0}
          totalCount={data?.totalElements ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={onSortingChange}
          manualSorting
          enableSorting
          emptyStateText={t('customerUser.claimRequests.empty')}
          tableWrapperClassName='max-h-130'
        />
      </div>
    </section>
  )
}

export default CustomerUserClaimRequestsPage
