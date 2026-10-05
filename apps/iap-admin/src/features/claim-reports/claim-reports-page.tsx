import { useCallback, useMemo, useState } from 'react'

import {
  type ClaimReportTableSearch,
  parseClaimReportTableSearch,
  toClaimReportTableSearch,
} from '@features/claim-reports/route-adapters/table-search'
import type {
  OutpatientDocAcceptance,
  PageOutpatientDocAcceptance,
} from '@iap/api-types'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, cn } from '@iap/ui'
import { PaginatedDataTable, useTableFilterQueryParams } from '@shared/tables'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import type { VisibilityState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { useClaimReportColumns } from './components/claim-report-columns'
import { ClaimReportDataTableToolbar } from './components/claim-report-data-table-toolbar'
import { ClaimReportsSurface } from './components/claim-reports-surface'
import { outpatientDocAcceptanceService } from './services/outpatient-doc-acceptance-service'

const EMPTY_CLAIM_REPORTS: OutpatientDocAcceptance[] = []

export function ClaimReportsPage() {
  const { t } = useTranslation()
  const search = useRouterState({
    select: (state) => state.location.search as ClaimReportTableSearch,
  })
  const tableState = useTableFilterQueryParams({
    parse: parseClaimReportTableSearch,
    search,
    serialize: toClaimReportTableSearch,
  })
  const filters = useMemo<ApiFilterParams>(
    () =>
      tableState.filters.sort
        ? tableState.filters
        : {
            ...tableState.filters,
            direction: 'desc',
            sort: 'exId',
          },
    [tableState.filters]
  )
  const query = useQuery<PageOutpatientDocAcceptance>({
    placeholderData: (previousData) => previousData,
    queryFn: ({ signal }) =>
      outpatientDocAcceptanceService.getPage({
        filters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['claim-reports', tableState.pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const columns = useClaimReportColumns()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const reports = query.data?.content ?? EMPTY_CLAIM_REPORTS
  const refresh = useCallback(() => void query.refetch(), [query])

  return (
    <ClaimReportsSurface>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('claimReports.title')}
          </h2>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            className='space-x-2'
            disabled={query.isLoading}
            onClick={refresh}
            variant='outline'
          >
            <IconRefresh
              size={18}
              className={cn(query.isLoading && 'animate-spin')}
            />
            <span>{t('claimReports.actions.refresh')}</span>
          </Button>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <ClaimReportDataTableToolbar />
        <PaginatedDataTable<OutpatientDocAcceptance>
          columns={columns}
          columnVisibility={columnVisibility}
          data={reports}
          enableSorting
          isLoading={query.isLoading}
          labels={{ empty: t('claimReports.messages.noClaimReports') }}
          onColumnVisibilityChange={setColumnVisibility}
          onPaginationChange={tableState.onPaginationChange}
          onSortingChange={tableState.onSortingChange}
          pageCount={query.data?.totalPages ?? 0}
          pagination={tableState.pagination}
          manualFiltering
          sorting={tableState.sorting}
          tableWrapperClassName='max-h-140'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>
    </ClaimReportsSurface>
  )
}
