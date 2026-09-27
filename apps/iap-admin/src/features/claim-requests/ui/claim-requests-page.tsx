import { useCallback, useEffect, useMemo } from 'react'

import { isDoctorRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  parseTableFilterSearch,
  toTableFilterSearch,
} from '@shared/tables'
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
import {
  getClaimRequestQuickStatus,
  toClaimRequestApiFilters,
} from '../model/claim-request-filters'
import { useClaimRequestStore } from '../model/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'
import { ClaimRequestBulkActionDialogs } from './claim-request-bulk-action-dialogs'
import { ClaimRequestBulkCoreAiDialog } from './claim-request-bulk-core-ai-dialog'
import { ClaimRequestBulkStatusChangeDialog } from './claim-request-bulk-status-change-dialog'
import { useClaimRequestColumns } from './claim-request-columns'
import { ClaimRequestFetchNewEmptyState } from './claim-request-fetch-new-empty-state'
import { ClaimRequestHeaderActions } from './claim-request-header-actions'
import { ClaimRequestProvider } from './claim-request-provider'
import { ClaimRequestToolbar } from './claim-request-toolbar'
import { ClaimRequestsTicketsPlaceholder } from './claim-requests-tickets-placeholder'

function resolveUpdater<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function toSearchRecord(value: Record<string, unknown>): TableFilterSearch {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => typeof item === 'string')
  ) as TableFilterSearch
}

function ClaimRequestsContent() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const router = useRouter()
  const search = toSearchRecord(
    router.state.location.search as Record<string, unknown>
  )
  const tableState = parseTableFilterSearch(search)
  const sorting = useMemo(
    () =>
      tableState.sorting.length
        ? tableState.sorting
        : [{ desc: false, id: 'createdAt' }],
    [tableState.sorting]
  )
  const isDoctor = isDoctorRole(user?.roles ?? [])
  const quickStatus = getClaimRequestQuickStatus(tableState.filters, isDoctor)
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
    setRowSelection({})
  }, [
    setRowSelection,
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
  ])
  const updateTableState = useCallback(
    (nextPagination: PaginationState, nextSorting: SortingState) => {
      router.navigate({
        replace: true,
        search: toTableFilterSearch({
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
  const onQuickStatusChange = useCallback(
    (nextQuickStatus: typeof quickStatus) => {
      router.navigate({
        replace: true,
        search: {
          ...toTableFilterSearch({ ...tableState, sorting }),
          page: '1',
          quickStatus: nextQuickStatus,
        } as never,
        to: './',
      })
    },
    [router, sorting, tableState]
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
            onRefresh={() => void query.refetch()}
            selectedIds={selectedIds}
          />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <ClaimRequestToolbar
            count={query.data?.totalElements ?? 0}
            isFetching={query.isLoading || query.isFetching}
            onQuickStatusChange={onQuickStatusChange}
            quickStatus={quickStatus}
          />
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
            labels={{
              empty: t('common.noRecords'),
              loading: t('common.loading'),
            }}
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
      <ClaimRequestBulkActionDialogs
        claimRequestIds={selectedIds}
        onSuccess={() => void query.refetch()}
      />
      <ClaimRequestBulkCoreAiDialog
        claimRequestIds={selectedIds}
        onSuccess={() => void query.refetch()}
      />
      <ClaimRequestBulkStatusChangeDialog
        claimRequestIds={selectedIds}
        onSuccess={() => void query.refetch()}
      />
    </>
  )
}

export function ClaimRequestsPage() {
  const location = useLocation()
  const feature = getClaimRequestFeature(location.search)

  if (feature === CLAIM_REQUEST_FEATURES.tickets) {
    return <ClaimRequestsTicketsPlaceholder />
  }

  return (
    <ClaimRequestProvider>
      <ClaimRequestsContent />
    </ClaimRequestProvider>
  )
}
