import { type ReactNode, useCallback, useMemo } from 'react'

import {
  type TicketColumnsVariant,
  useTicketColumns,
} from '@features/tickets/components/ticket-columns'
import { TicketDetailSheet } from '@features/tickets/components/ticket-detail-sheet'
import { TicketsDataTableToolbar } from '@features/tickets/components/tickets-data-table-toolbar'
import { toTicketApiFilters } from '@features/tickets/model/ticket-filters'
import {
  parseTicketTableSearch,
  toTicketTableSearch,
} from '@features/tickets/pages/index/route-adapters/table-search'
import { ticketService } from '@features/tickets/services/ticket-service'
import type { SupportTicket } from '@iap/api-types'
import { Button } from '@iap/ui'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type TicketsContentProps = {
  beforeStatusFilter?: ReactNode
  ticketColumnsVariant?: TicketColumnsVariant
  ticketStatusFilterVariant?: 'claim-request-context' | 'default'
  title?: string
}

function resolveUpdater<T>(updater: Updater<T>, previous: T) {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function TicketsContent(props: TicketsContentProps) {
  const {
    beforeStatusFilter,
    ticketColumnsVariant,
    ticketStatusFilterVariant,
    title,
  } = props
  const { t } = useTranslation()
  const location = useLocation()
  const router = useRouter()
  const tableState = useMemo(
    () =>
      parseTicketTableSearch(
        Object.fromEntries(
          Object.entries(location.search).filter(
            ([, value]) =>
              typeof value === 'string' ||
              (Array.isArray(value) &&
                value.every((entry) => typeof entry === 'string'))
          )
        ) as Record<string, string | string[] | undefined>
      ),
    [location.search]
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
  const columns = useTicketColumns(ticketColumnsVariant)
  const tickets = useMemo(() => query.data?.content ?? [], [query.data])
  const updateTableState = useCallback(
    (nextPagination: PaginationState, nextSorting: SortingState) => {
      router.navigate({
        replace: true,
        search: toTicketTableSearch({
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
      <section className='pb-4'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold tracking-tight'>
              {title ?? t('tickets.title')}
            </h2>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
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
        </div>
        {query.isError ? (
          <div className='mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'>
            {t('tickets.error')}
          </div>
        ) : null}
        <TicketsDataTableToolbar
          beforeStatusFilter={beforeStatusFilter}
          count={query.data?.totalElements ?? undefined}
          isLoading={query.isLoading || query.isFetching}
          ticketStatusFilterVariant={ticketStatusFilterVariant}
        />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <PaginatedDataTable<SupportTicket>
            columns={columns}
            data={tickets}
            emptyStateText={t('tickets.empty')}
            enableSorting
            isLoading={query.isLoading}
            manualSorting
            onPaginationChange={onPaginationChange}
            onSortingChange={onSortingChange}
            pageCount={query.data?.totalPages ?? 0}
            pagination={tableState.pagination}
            sorting={sorting}
            tableWrapperClassName='max-h-130'
            totalCount={query.data?.totalElements ?? 0}
          />
        </div>
      </section>
      <TicketDetailSheet refetch={query.refetch} />
    </>
  )
}
