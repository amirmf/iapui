import { useEffect, useMemo } from 'react'

import { CoverageDamageCodeApplsSection } from '@features/coverage-damage-code-appls'
import { CoverageDeleteMethodDialog } from '@features/coverages/components/coverage-dialogs/coverage-delete-method-dialog'
import { CoverageFormDialog } from '@features/coverages/components/coverage-dialogs/coverage-form-dialog'
import { CoverageViewDialog } from '@features/coverages/components/coverage-dialogs/coverage-view-dialog'
import { useCoverageColumns } from '@features/coverages/components/coverage-table/coverage-columns'
import { CoverageDataTableToolbar } from '@features/coverages/components/coverage-table/coverage-data-table-toolbar'
import { useCoverageStore } from '@features/coverages/context/store/coverage-store'
import {
  parseCoverageTableSearch,
  toCoverageApiFilters,
  toCoverageTableSearch,
} from '@features/coverages/route-adapters/table-search'
import { coverageService } from '@features/coverages/services/coverage-service'
import type { Coverage } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'

const EMPTY_COVERAGES: Coverage[] = []
export function CoveragesPage() {
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useTableFilterQueryParams({
    parse: parseCoverageTableSearch,
    search,
    serialize: toCoverageTableSearch,
  })
  const columns = useCoverageColumns()
  const rowSelection = useCoverageStore((state) => state.rowSelection)
  const setCurrentRow = useCoverageStore((state) => state.setCurrentRow)
  const setOpenDialog = useCoverageStore((state) => state.setOpenDialog)
  const setRowSelection = useCoverageStore((state) => state.setRowSelection)
  const filters = useMemo<ApiFilterParams>(
    () => toCoverageApiFilters(tableState.filters),
    [tableState.filters]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      coverageService.getPageFull({
        filters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['coverages', tableState.pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const coverages = query.data?.content ?? EMPTY_COVERAGES
  const canManage = isSuperAdminRole(user?.roles ?? [])
  const selectedCoverage = useMemo(() => {
    const [rowId] =
      Object.entries(rowSelection).find(([, selected]) => selected) ?? []
    return rowId === undefined ? null : (coverages[Number(rowId)] ?? null)
  }, [coverages, rowSelection])
  useEffect(() => {
    setRowSelection({})
  }, [
    setRowSelection,
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
  ])
  return (
    <>
      <div className='flex flex-col gap-4 pb-4'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('coverages.title')}
          </h2>
          <div className='flex flex-wrap gap-2'>
            <Permission hasPermission={canManage}>
              <Button
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() => {
                  if (selectedCoverage) {
                    setCurrentRow(selectedCoverage)
                    setOpenDialog('deleteMethod')
                  }
                }}
                variant='outline'
              >
                <Trash2 aria-hidden='true' className='size-4' />
                {t('common.delete')}
              </Button>
            </Permission>
            <Button
              disabled={query.isLoading}
              onClick={() => void query.refetch()}
              variant='outline'
            >
              <RefreshCw
                aria-hidden='true'
                className={cn('size-4', query.isLoading && 'animate-spin')}
              />
              {t('coverages.refresh')}
            </Button>
            <Button onClick={() => setOpenDialog('create')}>
              <Plus aria-hidden='true' className='size-4' />
              {t('coverages.create')}
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <CoverageDataTableToolbar
            onValuesChange={tableState.onFiltersChange}
            values={tableState.filters}
          />
          <PaginatedDataTable
            columns={columns}
            data={coverages}
            emptyStateText={t('coverages.noCoverages')}
            enableSorting
            hasActiveFilters={Object.keys(tableState.filters).length > 0}
            hasCheckboxes
            isLoading={query.isLoading}
            manualFiltering
            onPaginationChange={tableState.onPaginationChange}
            onRowSelectionChange={setRowSelection}
            onSortingChange={tableState.onSortingChange}
            pageCount={query.data?.totalPages ?? 0}
            pagination={tableState.pagination}
            rowSelection={rowSelection}
            sorting={tableState.sorting}
            tableWrapperClassName='max-h-60'
            totalCount={query.data?.totalElements ?? 0}
          />
        </div>
        <CoverageDamageCodeApplsSection
          coverageDetailId={selectedCoverage?.id ?? null}
        />
      </div>
      <CoverageFormDialog />
      <CoverageViewDialog />
      <CoverageDeleteMethodDialog coverages={coverages} />
    </>
  )
}
