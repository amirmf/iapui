import { useMemo } from 'react'

import {
  ClaimRequestDataTableToolbar,
  applyClaimRequestQuickStatusFilter,
} from '@features/claim-requests'
import type { PageClaimRequest } from '@iap/api-types'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

import { useAgentClaimRequestColumns } from '../components/agent-claim-request-columns'
import { AgentClaimRequestDeleteDialog } from '../components/agent-claim-request-delete-dialog'
import AgentClaimRequestHeaderActions from '../components/agent-claim-request-header-actions'
import AgentClaimRequestProvider from '../context/claim-request-context'
import useSyncQueryParamsTableFilter from '../route-adapters/use-sync-query-params-table-filter'
import agentClaimRequestService from '../services/agent-claim-request-service'

function AgentClaimRequestsPage() {
  const { t } = useTranslation()
  const columns = useAgentClaimRequestColumns()
  const { setPagination, pagination, filters, sorting, onSortingChange } =
    useSyncQueryParamsTableFilter()

  const {
    data: pageData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<PageClaimRequest>({
    queryKey: ['agentClaimRequests', pagination, filters],
    queryFn: ({ signal }) =>
      agentClaimRequestService.getPage({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        filters: produce(filters, (draft) => {
          if (!filters.sort) {
            filters.sort = 'createdAt'
            filters.direction = 'asc'
          }
          const quickStatusFromFilters = draft['quickStatus'] as
            string | undefined
          const quickStatus = quickStatusFromFilters ?? 'IN_ASSESSMENT'
          if (quickStatus) {
            applyClaimRequestQuickStatusFilter(draft, quickStatus)
          }
        }),
        signal,
      }),
    staleTime: 5000,
    gcTime: 5000,
    refetchOnWindowFocus: false,
  })

  const claimRequests = useMemo(() => pageData?.content ?? [], [pageData])
  const pageCount = pageData?.totalPages ?? 0
  const totalCount = pageData?.totalElements ?? 0

  return (
    <AgentClaimRequestProvider>
      <div className='pb-4'>
        <Main>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold tracking-tight'>
                {t('agent.claimRequests.title')}
              </h2>
            </div>
            <AgentClaimRequestHeaderActions
              isLoading={isLoading || isFetching}
              onRefetch={refetch}
              filters={produce(filters, (draft) => {
                draft.page = pagination.pageIndex
                draft.size = pagination.pageSize
              })}
            />
          </div>

          <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
            <ClaimRequestDataTableToolbar
              count={pageData?.totalElements ?? undefined}
              isLoading={isLoading || isFetching}
            />
            <PaginatedDataTable
              columns={columns}
              data={claimRequests}
              isLoading={isLoading}
              pageCount={pageCount}
              totalCount={totalCount}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={onSortingChange}
              manualSorting
              enableSorting
              presentation='reference'
              tableWrapperClassName='max-h-130'
            />
          </div>
        </Main>
        <AgentClaimRequestDeleteDialog refetch={refetch} />
      </div>
    </AgentClaimRequestProvider>
  )
}

export default AgentClaimRequestsPage
export { AgentClaimRequestsPage }
