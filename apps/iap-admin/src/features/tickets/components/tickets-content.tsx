import { type ReactNode, useCallback, useMemo, useState } from 'react'

import {
  type TicketColumnsVariant,
  useTicketColumns,
} from '@features/tickets/components/ticket-columns'
import { TicketDetailSheet } from '@features/tickets/components/ticket-detail-sheet'
import { TicketsDataTableToolbar } from '@features/tickets/components/tickets-data-table-toolbar'
import { toTicketApiFilters } from '@features/tickets/model/ticket-filters'
import { parseTicketTableSearch } from '@features/tickets/pages/index/route-adapters/table-search'
import { ticketService } from '@features/tickets/services/ticket-service'
import type { SupportTicket } from '@iap/api-types'
import { Button, cn } from '@iap/ui'
import { PaginatedDataTable } from '@shared/tables'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
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
  const [sorting, setSorting] = useState<SortingState>(() => tableState.sorting)
  const filters = useMemo(
    () =>
      toTicketApiFilters(
        {
          ...tableState.filters,
          ...(typeof location.search.sort === 'string'
            ? { sort: location.search.sort }
            : {}),
          ...(typeof location.search.direction === 'string'
            ? { direction: location.search.direction }
            : {}),
        },
        tableState.sorting
      ),
    [location.search, tableState.sorting, tableState.filters]
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
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = resolveUpdater(updater, tableState.pagination)
      void router.navigate({
        replace: true,
        search: (previous: Record<string, unknown>) =>
          ({
            ...previous,
            page: String(next.pageIndex + 1),
            size: String(next.pageSize),
          }) as never,
        to: './',
      })
    },
    [router, tableState.pagination]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = resolveUpdater(updater, sorting)
      setSorting(next)
      void router.navigate({
        replace: true,
        search: (previous: Record<string, unknown>) => {
          const search = { ...previous }
          if (next[0]) {
            search.sort = next[0].id
            search.direction = next[0].desc ? 'desc' : 'asc'
          } else {
            delete search.sort
            delete search.direction
          }
          return search as never
        },
        to: './',
      })
    },
    [router, sorting]
  )

  return (
    <>
      <section>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold tracking-tight'>
              {title ?? t('tickets.title')}
            </h2>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              presentation='reference'
              disabled={query.isLoading || query.isFetching}
              onClick={() => void query.refetch()}
              variant='outline'
            >
              <IconRefresh
                aria-hidden='true'
                className={cn(query.isFetching && 'animate-spin')}
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
            presentation='reference'
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
