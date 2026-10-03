import { useCallback, useEffect, useMemo } from 'react'

import { CoverageDamageCodeApplsSection } from '@features/coverage-damage-code-appls/ui/coverage-damage-code-appls-section'
import { useCoverageStore } from '@features/coverages/model/coverage-store'
import {
  parseCoverageTableSearch,
  toCoverageApiFilters,
  toCoverageTableSearch,
} from '@features/coverages/model/coverage-table-state'
import { useCoverageColumns } from '@features/coverages/pages/index/components/coverage-columns'
import { CoverageDataTableToolbar } from '@features/coverages/pages/index/components/coverage-data-table-toolbar'
import { CoverageDeleteMethodDialog } from '@features/coverages/pages/index/components/coverage-delete-method-dialog'
import { CoverageFormDialog } from '@features/coverages/pages/index/components/coverage-form-dialog'
import { CoverageViewDialog } from '@features/coverages/pages/index/components/coverage-view-dialog'
import { coverageService } from '@features/coverages/services/coverage-service'
import type { Coverage } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  type TableFilterValues,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'

const EMPTY_COVERAGES: Coverage[] = []
function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function CoveragesPage() {
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useMemo(() => parseCoverageTableSearch(search), [search])
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
  const updateTableState = useCallback(
    (
      pagination: PaginationState,
      sorting: SortingState,
      filters = tableState.filters
    ) => {
      router.navigate({
        replace: true,
        search: toCoverageTableSearch({
          filters,
          pagination,
          sorting,
        }) as never,
        to: './',
      })
    },
    [router, tableState.filters]
  )
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      updateTableState(
        resolveUpdater(updater, tableState.pagination),
        tableState.sorting
      ),
    [tableState.pagination, tableState.sorting, updateTableState]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) =>
      updateTableState(
        tableState.pagination,
        resolveUpdater(updater, tableState.sorting)
      ),
    [tableState.pagination, tableState.sorting, updateTableState]
  )
  const onFilterValuesChange = useCallback(
    (updater: (previous: TableFilterValues) => TableFilterValues) =>
      updateTableState(
        { ...tableState.pagination, pageIndex: 0 },
        tableState.sorting,
        updater(tableState.filters)
      ),
    [
      tableState.filters,
      tableState.pagination,
      tableState.sorting,
      updateTableState,
    ]
  )
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
            onValuesChange={onFilterValuesChange}
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
            onPaginationChange={onPaginationChange}
            onRowSelectionChange={setRowSelection}
            onSortingChange={onSortingChange}
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
