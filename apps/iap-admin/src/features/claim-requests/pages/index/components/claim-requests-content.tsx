import { useEffect, useMemo } from 'react'

import { ClaimRequestBulkCoreAiDialog } from '@features/claim-requests/pages/index/components/claim-request-bulk-core-ai-dialog'
import { ClaimRequestBulkDeleteDialog } from '@features/claim-requests/pages/index/components/claim-request-bulk-delete-dialog'
import { ClaimRequestBulkStatusChangeDialog } from '@features/claim-requests/pages/index/components/claim-request-bulk-status-change-dialog'
import { useClaimRequestColumns } from '@features/claim-requests/pages/index/components/claim-request-columns'
import { ClaimRequestDataTableToolbar } from '@features/claim-requests/pages/index/components/claim-request-data-table-toolbar'
import { ClaimRequestFetchNewEmptyState } from '@features/claim-requests/pages/index/components/claim-request-fetch-new-empty-state'
import { ClaimRequestGenerateAndSendBulkDialog } from '@features/claim-requests/pages/index/components/claim-request-generate-and-send-bulk-dialog'
import { ClaimRequestHeaderActions } from '@features/claim-requests/pages/index/components/claim-request-header-actions'
import { ClaimRequestRowActionDialogs } from '@features/claim-requests/pages/index/components/claim-request-row-action-dialogs'
import { useClaimRequestIds } from '@features/claim-requests/context/store/claim-request-ids-store'
import { useClaimRequestStore } from '@features/claim-requests/pages/index/context/store/claim-request-store'
import { getClaimRequestRowClassName } from '@features/claim-requests/pages/index/components/claim-request-row-class-name'
import { useClaimRequestsQuery } from '@features/claim-requests/pages/index/queries/use-claim-requests-query'
import { useClaimRequestTableSearch } from '@features/claim-requests/pages/index/route-adapters/use-claim-request-table-search'
import type { ClaimRequest } from '@iap/api-types'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { useTranslation } from 'react-i18next'

export function ClaimRequestsContent() {
  const { t } = useTranslation()
  const {
    isDoctor,
    quickStatus,
    sorting,
    onPaginationChange,
    onSortingChange,
    tableState,
    apiFilterSearch,
  } = useClaimRequestTableSearch()
  const { query, effectiveFilters } = useClaimRequestsQuery(
    tableState,
    isDoctor,
    apiFilterSearch
  )
  const columns = useClaimRequestColumns()
  const setIds = useClaimRequestIds((state) => state.setIds)
  const rowSelection = useClaimRequestStore((state) => state.rowSelection)
  const clearRowSelection = useClaimRequestStore(
    (state) => state.clearRowSelection
  )
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const claimRequests = useMemo(() => query.data?.content ?? [], [query.data])
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => claimRequests[Number(rowId)]?.id)
        .filter((id): id is string => Boolean(id)),
    [claimRequests, rowSelection]
  )

  useEffect(() => {
    const ids = claimRequests.flatMap((claimRequest) =>
      claimRequest.id ? [claimRequest.id] : []
    )
    if (ids.length) setIds(ids)
  }, [claimRequests, setIds])

  useEffect(() => {
    clearRowSelection()
  }, [
    clearRowSelection,
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
  ])

  return (
    <>
      <div className='pb-4'>
        <Main>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold tracking-tight'>
                {t('claimRequests.title')}
              </h2>
            </div>
            <ClaimRequestHeaderActions
              filters={{
                ...effectiveFilters,
                page: tableState.pagination.pageIndex,
                size: tableState.pagination.pageSize,
              }}
              isLoading={query.isLoading || query.isFetching}
              onRefetch={() => query.refetch()}
              claimRequestIds={selectedIds}
            />
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
            <ClaimRequestDataTableToolbar
              count={query.data?.totalElements ?? 0}
              isLoading={query.isLoading || query.isFetching}
            />
            <PaginatedDataTable<ClaimRequest>
              presentation='reference'
              getRowClassName={getClaimRequestRowClassName}
              columns={columns}
              data={claimRequests}
              emptyStateText={
                quickStatus === 'IN_ASSESSMENT' ? (
                  <ClaimRequestFetchNewEmptyState
                    onFetch={() => void query.refetch()}
                  />
                ) : undefined
              }
              enableSorting
              isLoading={query.isLoading}
              manualSorting
              onPaginationChange={onPaginationChange}
              onRowSelectionChange={setRowSelection}
              onSortingChange={onSortingChange}
              pageCount={query.data?.totalPages ?? 0}
              pagination={tableState.pagination}
              rowSelection={rowSelection}
              sorting={sorting}
              tableWrapperClassName='max-h-130'
              totalCount={query.data?.totalElements ?? 0}
              hasCheckboxes
            />
          </div>
        </Main>
      </div>
      <ClaimRequestBulkDeleteDialog
        claimRequestIds={selectedIds}
        onSuccess={() => query.refetch()}
      />
      <ClaimRequestGenerateAndSendBulkDialog
        claimRequestIds={selectedIds}
        onSuccess={() => query.refetch()}
      />
      <ClaimRequestBulkCoreAiDialog
        claimRequestIds={selectedIds}
        onSuccess={() => query.refetch()}
      />
      <ClaimRequestBulkStatusChangeDialog
        claimRequestIds={selectedIds}
        onSuccess={() => query.refetch()}
      />
      <ClaimRequestRowActionDialogs onSuccess={() => query.refetch()} />
    </>
  )
}
