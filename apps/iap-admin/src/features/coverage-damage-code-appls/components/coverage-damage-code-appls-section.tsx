import { useCallback, useEffect, useMemo, useState } from 'react'

import { useCoverageDamageCodeApplColumns } from '@features/coverage-damage-code-appls/components/coverage-damage-code-appl-columns'
import { CoverageDamageCodeApplDeleteMethodDialog } from '@features/coverage-damage-code-appls/components/coverage-damage-code-appl-delete-method-dialog'
import { CoverageDamageCodeApplFormDialog } from '@features/coverage-damage-code-appls/components/coverage-damage-code-appl-form-dialog'
import { CoverageDamageCodeApplViewDialog } from '@features/coverage-damage-code-appls/components/coverage-damage-code-appl-view-dialog'
import { CoverageDamageCodeApplsDataTableToolbar } from '@features/coverage-damage-code-appls/components/coverage-damage-code-appls-data-table-toolbar'
import { useCoverageDamageCodeApplStore } from '@features/coverage-damage-code-appls/context/store/coverage-damage-code-appl-store'
import { coverageDamageCodeApplService } from '@features/coverage-damage-code-appls/services/coverage-damage-code-appl-service'
import type { CoverageDamageCodeApplFull } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { PaginatedDataTable, type TableFilterValues } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState, Updater } from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'

const EMPTY_APPLS: CoverageDamageCodeApplFull[] = []

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function withCoverageDetailFilter(
  filters: TableFilterValues,
  coverageDetailId?: string | null
): TableFilterValues {
  const otherFilters = Object.fromEntries(
    Object.entries(filters).filter(([key]) => key !== 'coverageDetailId')
  )
  return coverageDetailId ? { ...otherFilters, coverageDetailId } : otherFilters
}

export function CoverageDamageCodeApplsSection(props: {
  coverageDetailId?: string | null
}) {
  const { coverageDetailId } = props
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const columns = useCoverageDamageCodeApplColumns()
  const rowSelection = useCoverageDamageCodeApplStore(
    (state) => state.rowSelection
  )
  const setCurrentRow = useCoverageDamageCodeApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useCoverageDamageCodeApplStore(
    (state) => state.setOpenDialog
  )
  const setRowSelection = useCoverageDamageCodeApplStore(
    (state) => state.setRowSelection
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 40,
  })
  const [filterValues, setFilterValues] = useState<TableFilterValues>(() =>
    withCoverageDetailFilter({}, coverageDetailId)
  )
  const filters = useMemo<ApiFilterParams>(
    () => withCoverageDetailFilter(filterValues, coverageDetailId),
    [coverageDetailId, filterValues]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      coverageDamageCodeApplService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['coverage-damage-code-appls', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const appls = query.data?.content ?? EMPTY_APPLS
  const selectedAppl = useMemo(() => {
    const [rowId] =
      Object.entries(rowSelection).find(([, selected]) => selected) ?? []
    return rowId === undefined ? null : (appls[Number(rowId)] ?? null)
  }, [appls, rowSelection])

  useEffect(() => {
    setFilterValues((previous) =>
      withCoverageDetailFilter(previous, coverageDetailId)
    )
    setPagination((previous) =>
      previous.pageIndex === 0 ? previous : { ...previous, pageIndex: 0 }
    )
  }, [coverageDetailId])
  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      setPagination((previous) => resolveUpdater(updater, previous)),
    []
  )
  const onFilterValuesChange = useCallback(
    (updater: (previous: TableFilterValues) => TableFilterValues) => {
      setFilterValues((previous) =>
        withCoverageDetailFilter(updater(previous), coverageDetailId)
      )
      setPagination((previous) => ({ ...previous, pageIndex: 0 }))
    },
    [coverageDetailId]
  )

  return (
    <section className='h-full'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('coverageDamageCodeAppls.title')}
        </h2>
        <div className='flex flex-wrap gap-2'>
          <Permission hasPermission={isSuperAdminRole(user?.roles ?? [])}>
            <Button
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => {
                if (selectedAppl) {
                  setCurrentRow(selectedAppl)
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
            {t('coverageDamageCodeAppls.refresh')}
          </Button>
          <Button onClick={() => setOpenDialog('create')}>
            <Plus aria-hidden='true' className='size-4' />
            {t('coverageDamageCodeAppls.create')}
          </Button>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <CoverageDamageCodeApplsDataTableToolbar
          onValuesChange={onFilterValuesChange}
          values={filterValues}
        />
        <PaginatedDataTable
          columns={columns}
          data={appls}
          emptyStateText={t('common.noRecords')}
          enableSorting={false}
          hasActiveFilters={Object.keys(filters).some(
            (key) => key !== 'coverageDetailId'
          )}
          hasCheckboxes
          isLoading={query.isLoading}
          manualFiltering
          onPaginationChange={onPaginationChange}
          onRowSelectionChange={setRowSelection}
          pageCount={query.data?.totalPages ?? 0}
          pagination={pagination}
          rowSelection={rowSelection}
          tableWrapperClassName='max-h-60'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>
      <CoverageDamageCodeApplFormDialog />
      <CoverageDamageCodeApplViewDialog />
      <CoverageDamageCodeApplDeleteMethodDialog appls={appls} />
    </section>
  )
}
