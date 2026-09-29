import { useCallback, useMemo } from 'react'

import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
  type ClaimRequestQuickStatus,
  ClaimRequestQuickStatusFilter,
} from '@features/claim-requests'
import { Button } from '@iap/ui'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { toTicketApiFilters } from '../model/ticket-filters'
import { toClaimRequestsSearch } from '../model/ticket-navigation'
import {
  parseTicketTableSearch,
  toTicketTableSearch,
} from '../model/ticket-table-state'
import { ticketService } from '../services/ticket-service'
import { useTicketColumns } from './ticket-columns'
import { TicketDetailSheet } from './ticket-detail-sheet'
import { TicketProvider } from './ticket-provider'
import { TicketToolbar } from './ticket-toolbar'

function resolveUpdater<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function ClaimRequestTicketsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const search = router.state.location.search as Record<string, unknown>
  const tableState = useMemo(
    () =>
      parseTicketTableSearch(
        Object.fromEntries(
          Object.entries(search).filter(
            ([, value]) =>
              typeof value === 'string' ||
              (Array.isArray(value) &&
                value.every((entry) => typeof entry === 'string'))
          )
        ) as Record<string, string | string[] | undefined>
      ),
    [search]
  )
  const sorting = useMemo<SortingState>(
    () =>
      tableState.sorting.length
        ? tableState.sorting
        : [{ desc: false, id: 'updatedAt' }],
    [tableState.sorting]
  )
  const filters = useMemo(
    () => toTicketApiFilters(tableState.filters, sorting),
    [sorting, tableState.filters]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      ticketService.findPage({
        query: {
          filters,
          page: tableState.pagination.pageIndex,
          size: tableState.pagination.pageSize,
        },
        signal,
      }),
    queryKey: ['tickets', tableState.pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const columns = useTicketColumns()
  const tickets = useMemo(() => query.data?.content ?? [], [query.data])
  const updateTableState = useCallback(
    (nextPagination: PaginationState, nextSorting: SortingState) => {
      router.navigate({
        replace: true,
        search: {
          ...toTicketTableSearch({
            filters: tableState.filters,
            pagination: nextPagination,
            sorting: nextSorting,
          }),
          [CLAIM_REQUEST_FEATURE_QUERY_KEY]: CLAIM_REQUEST_FEATURES.tickets,
          quickStatus: CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
        } as never,
        to: '/claim-requests/',
      })
    },
    [router, tableState.filters]
  )
  const handlePaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      updateTableState(resolveUpdater(updater, tableState.pagination), sorting),
    [sorting, tableState.pagination, updateTableState]
  )
  const handleSortingChange = useCallback(
    (updater: Updater<SortingState>) =>
      updateTableState(tableState.pagination, resolveUpdater(updater, sorting)),
    [sorting, tableState.pagination, updateTableState]
  )
  const handleQuickStatusChange = useCallback(
    (status: ClaimRequestQuickStatus) => {
      if (status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS) return

      router.navigate({
        replace: true,
        search: toClaimRequestsSearch(status) as never,
        to: '/claim-requests/',
      })
    },
    [router]
  )

  return (
    <TicketProvider>
      <section className='pb-4'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('claimRequests.status.needsReassessment')}
          </h2>
          <Button
            disabled={query.isLoading || query.isFetching}
            onClick={() => void query.refetch()}
            variant='outline'
          >
            <RefreshCw
              aria-hidden='true'
              className={query.isFetching ? 'animate-spin' : ''}
            />
            <span>{t('tickets.refresh')}</span>
          </Button>
        </div>
        <div className='mb-4'>
          <ClaimRequestQuickStatusFilter
            isFetching={false}
            onQuickStatusChange={handleQuickStatusChange}
            quickStatus={CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS}
          />
        </div>
        <TicketToolbar
          count={query.data?.totalElements ?? undefined}
          isFetching={query.isLoading || query.isFetching}
        />
        {query.isError ? (
          <p className='mb-4 text-sm text-destructive' role='alert'>
            {t('tickets.error')}
          </p>
        ) : null}
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <PaginatedDataTable
            columns={columns}
            data={tickets}
            emptyStateText={t('tickets.empty')}
            enableSorting
            isLoading={query.isLoading}
            manualSorting
            onPaginationChange={handlePaginationChange}
            onSortingChange={handleSortingChange}
            pageCount={query.data?.totalPages ?? 0}
            pagination={tableState.pagination}
            sorting={sorting}
            tableWrapperClassName='max-h-130'
            totalCount={query.data?.totalElements ?? 0}
          />
        </div>
      </section>
      <TicketDetailSheet onRefetch={query.refetch} />
    </TicketProvider>
  )
}
