import { type ReactNode, useMemo, useState } from 'react'

import {
  type TicketColumnsVariant,
  useTicketColumns,
} from '@features/tickets/components/ticket-columns'
import { TicketDetailSheet } from '@features/tickets/components/ticket-detail-sheet/ticket-detail-sheet'
import { TicketsDataTableToolbar } from '@features/tickets/components/tickets-data-table-toolbar'
import { ticketPageQueryOptions } from '@features/tickets/queries/ticket-queries'
import { toTicketApiFilters } from '@features/tickets/route-adapters/ticket-filters'
import {
  useTicketTableNavigation,
  useTicketTableSearch,
} from '@features/tickets/route-adapters/use-ticket-table-search'
import type { SupportTicket } from '@iap/api-types'
import { Button, cn } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

type TicketsContentProps = {
  beforeStatusFilter?: ReactNode
  ticketColumnsVariant?: TicketColumnsVariant
  ticketStatusFilterVariant?: 'claim-request-context' | 'default'
  title?: string
}

export function TicketsContent(props: TicketsContentProps) {
  const {
    beforeStatusFilter,
    ticketColumnsVariant,
    ticketStatusFilterVariant,
    title,
  } = props
  const { t } = useTranslation()
  const { tableState, search } = useTicketTableSearch()
  const [sorting, setSorting] = useState<SortingState>(() => tableState.sorting)
  const filters = useMemo(
    () =>
      toTicketApiFilters(
        {
          ...tableState.filters,
          ...(typeof search.sort === 'string' ? { sort: search.sort } : {}),
          ...(typeof search.direction === 'string'
            ? { direction: search.direction }
            : {}),
        },
        tableState.sorting
      ),
    [search, tableState.sorting, tableState.filters]
  )
  const query = useQuery(
    ticketPageQueryOptions({
      query: {
        filters,
        page: tableState.pagination.pageIndex,
        size: tableState.pagination.pageSize,
      },
    })
  )
  const columns = useTicketColumns(ticketColumnsVariant)
  const tickets = useMemo(() => query.data?.content ?? [], [query.data])
  const { onPaginationChange, onSortingChange } = useTicketTableNavigation(
    tableState.pagination,
    sorting,
    setSorting
  )

  return (
    <>
      <Main>
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
      </Main>
      <TicketDetailSheet refetch={query.refetch} />
    </>
  )
}
