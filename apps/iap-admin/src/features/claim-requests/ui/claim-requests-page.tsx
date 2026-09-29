import { useCallback, useEffect, useMemo } from 'react'

import { ClaimRequestTicketsPage } from '@features/tickets'
import type { ApiFilterParams } from '@iap/shared-lib'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  CLAIM_REQUEST_FEATURES,
  getClaimRequestFeature,
} from '../model/claim-request-feature'
import { toClaimRequestApiFilters } from '../model/claim-request-filters'
import { toClaimRequestTableSearch } from '../model/claim-request-table-state'
import { useClaimRequestStore } from '../model/store/claim-request-store'
import { useClaimRequestTableSearch } from '../model/use-claim-request-table-search'
import { claimRequestService } from '../services/claim-request-service'
import { ClaimRequestBulkCoreAiDialog } from './claim-request-bulk-core-ai-dialog'
import { ClaimRequestBulkDeleteDialog } from './claim-request-bulk-delete-dialog'
import { ClaimRequestBulkStatusChangeDialog } from './claim-request-bulk-status-change-dialog'
import { useClaimRequestColumns } from './claim-request-columns'
import { ClaimRequestFetchNewEmptyState } from './claim-request-fetch-new-empty-state'
import { ClaimRequestGenerateAndSendBulkDialog } from './claim-request-generate-and-send-bulk-dialog'
import { ClaimRequestHeaderActions } from './claim-request-header-actions'
import { ClaimRequestProvider } from './claim-request-provider'
import { ClaimRequestQuickStatusFilter } from './claim-request-quick-status-filter'
import { ClaimRequestRowActionDialogs } from './claim-request-row-action-dialogs'
import { ClaimRequestToolbar } from './claim-request-toolbar'

function resolveUpdater<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function ClaimRequestsContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isDoctor, quickStatus, sorting, tableState } =
    useClaimRequestTableSearch()
  const apiFilters = useMemo(
    () => toClaimRequestApiFilters(tableState.filters, isDoctor),
    [isDoctor, tableState.filters]
  )
  const effectiveFilters = useMemo<ApiFilterParams>(
    () => ({
      ...apiFilters,
      direction: sorting[0]?.desc ? 'desc' : 'asc',
      sort: sorting[0]?.id ?? 'createdAt',
    }),
    [apiFilters, sorting]
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      claimRequestService.findPage({
        filters: effectiveFilters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    gcTime: 5_000,
    queryKey: ['claimRequests', tableState.pagination, effectiveFilters],
    refetchOnWindowFocus: false,
    staleTime: 5_000,
  })
  const columns = useClaimRequestColumns()
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
    clearRowSelection()
  }, [
    clearRowSelection,
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
  ])
  const updateTableState = useCallback(
    (nextPagination: PaginationState, nextSorting: SortingState) => {
      router.navigate({
        replace: true,
        search: toClaimRequestTableSearch({
          filters: tableState.filters,
          pagination: nextPagination,
          sorting: nextSorting,
        }) as never,
        to: './',
      })
    },
    [router, tableState.filters]
  )
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      updateTableState(resolveUpdater(updater, tableState.pagination), sorting),
    [sorting, tableState.pagination, updateTableState]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) =>
      updateTableState(tableState.pagination, resolveUpdater(updater, sorting)),
    [sorting, tableState.pagination, updateTableState]
  )

  return (
    <>
      <div className='pb-4'>
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
            isFetching={query.isLoading || query.isFetching}
            onRefresh={() => query.refetch()}
            selectedIds={selectedIds}
          />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <div className='mb-4'>
            <ClaimRequestToolbar quickStatus={quickStatus} />
            <ClaimRequestQuickStatusFilter
              count={query.data?.totalElements ?? 0}
              isFetching={query.isLoading || query.isFetching}
            />
          </div>
          <PaginatedDataTable
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
            hasActiveFilters={Object.keys(tableState.filters).some(
              (key) => key !== 'quickStatus'
            )}
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

export function ClaimRequestsPage() {
  const location = useLocation()
  const feature = getClaimRequestFeature(location.search)

  if (feature === CLAIM_REQUEST_FEATURES.tickets) {
    return <ClaimRequestTicketsPage />
  }

  return (
    <ClaimRequestProvider>
      <ClaimRequestsContent />
    </ClaimRequestProvider>
  )
}
