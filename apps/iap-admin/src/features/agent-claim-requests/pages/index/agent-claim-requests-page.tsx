import { useMemo } from 'react'

import { Main } from '@shared/components/layout/main'

import {
  AgentClaimRequestDeleteDialog,
  AgentClaimRequestsHeader,
  AgentClaimRequestsTable,
  useAgentClaimRequestColumns,
} from './components'
import { AgentClaimRequestProvider } from './context'
import { useAgentClaimRequestsQuery } from './queries/use-agent-claim-requests-query'
import { useSyncQueryParamsTableFilter } from './route-adapters'

export function AgentClaimRequestsPage() {
  const columns = useAgentClaimRequestColumns()
  const { setPagination, pagination, filters, sorting, onSortingChange } =
    useSyncQueryParamsTableFilter()

  const {
    data: pageData,
    isLoading,
    isFetching,
    refetch,
  } = useAgentClaimRequestsQuery({
    pagination,
    filters,
  })

  const claimRequests = useMemo(() => pageData?.content ?? [], [pageData])
  const pageCount = pageData?.totalPages ?? 0
  const totalCount = pageData?.totalElements ?? 0

  return (
    <AgentClaimRequestProvider>
      <div className='pb-4'>
        <Main>
          <AgentClaimRequestsHeader
            isLoading={isLoading || isFetching}
            pagination={pagination}
            filters={filters}
            onRefetch={refetch}
          />
          <AgentClaimRequestsTable
            columns={columns}
            data={claimRequests}
            isLoading={isLoading}
            isFetching={isFetching}
            totalElements={totalCount}
            totalPages={pageCount}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={onSortingChange}
          />
        </Main>
        <AgentClaimRequestDeleteDialog refetch={refetch} />
      </div>
    </AgentClaimRequestProvider>
  )
}

export default AgentClaimRequestsPage
