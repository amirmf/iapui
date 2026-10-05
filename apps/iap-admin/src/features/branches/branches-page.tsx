import { useCallback, useMemo } from 'react'

import { useBranchColumns } from '@features/branches/components/branch-columns'
import { BranchDataTableToolbar } from '@features/branches/components/branch-data-table-toolbar'
import { BranchDeleteDialog } from '@features/branches/components/branch-delete-dialog'
import { BranchFormDialog } from '@features/branches/components/branch-form-dialog'
import { BranchSyncButton } from '@features/branches/components/branch-sync-button'
import { BranchesPageSurface } from '@features/branches/components/branches-page-surface'
import { BranchProvider } from '@features/branches/context/provider/branch-provider'
import { useBranchStore } from '@features/branches/context/store/branch-store'
import {
  parseBranchTableSearch,
  toBranchApiFilters,
  toBranchTableSearch,
} from '@features/branches/queries/branch-table-state'
import { useBranchesData } from '@features/branches/queries/use-branches-data'
import type { Branch } from '@iap/api-types'
import { Button } from '@iap/ui'
import { PaginatedDataTable, type TableFilterSearch } from '@shared/tables'
import { useLocation, useRouter } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { Plus, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EMPTY_BRANCHES: Branch[] = []

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function BranchesContent() {
  const { t } = useTranslation()
  const location = useLocation()
  const router = useRouter()
  const currentRow = useBranchStore((state) => state.currentRow)
  const openDialog = useBranchStore((state) => state.openDialog)
  const setCurrentRow = useBranchStore((state) => state.setCurrentRow)
  const setOpenDialog = useBranchStore((state) => state.setOpenDialog)
  const tableState = useMemo(
    () => parseBranchTableSearch(location.search as TableFilterSearch),
    [location.search]
  )
  const filters = useMemo(
    () => toBranchApiFilters(tableState.filters, tableState.sorting),
    [tableState.filters, tableState.sorting]
  )
  const query = useBranchesData({
    filters,
    pagination: tableState.pagination,
  })
  const columns = useBranchColumns()
  const branches = query.data?.content ?? EMPTY_BRANCHES
  const updateTableState = useCallback(
    (
      pagination: PaginationState,
      sorting: SortingState,
      filters = tableState.filters
    ) => {
      router.navigate({
        replace: true,
        search: toBranchTableSearch({
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
    (updater: (previous: TableFilterSearch) => TableFilterSearch) => {
      router.navigate({
        replace: true,
        search: (previous: TableFilterSearch) => {
          const nextFilters = updater(tableState.filters)
          const next = { ...previous }

          for (const key of Object.keys(tableState.filters)) {
            if (!(key in nextFilters)) delete next[key]
          }
          Object.assign(next, nextFilters)

          const page = next.page
          if (typeof page === 'string') {
            if (Number(page) > 1) next.page = '1'
            else delete next.page
          }

          return next
        },
        to: './',
      } as never)
    },
    [router, tableState.filters]
  )
  const onResetFilters = useCallback(
    () =>
      router.navigate({
        replace: true,
        search: () => ({}),
        to: './',
      } as never),
    [router]
  )

  return (
    <>
      <div className='pb-4'>
        <BranchesPageSurface>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-bold tracking-tight'>
              {t('branches.title')}
            </h2>
            <div className='flex gap-2'>
              <BranchSyncButton onSuccess={() => void query.refetch()} />
              <Button
                className='space-x-2'
                onClick={() => void query.refetch()}
                variant='outline'
              >
                <RefreshCw aria-hidden='true' className='size-[18px]' />
                {t('branches.actions.refresh')}
              </Button>
              <Button
                className='space-x-2'
                onClick={() => setOpenDialog('create')}
              >
                <Plus aria-hidden='true' className='size-[18px]' />
                {t('branches.dialog.create')}
              </Button>
            </div>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
            <BranchDataTableToolbar
              onReset={onResetFilters}
              onValuesChange={onFilterValuesChange}
              values={tableState.filters}
            />
            <PaginatedDataTable<Branch>
              columns={columns}
              data={branches}
              emptyStateText={t('branches.noBranches')}
              enableSorting
              isLoading={query.isLoading}
              manualSorting
              onPaginationChange={onPaginationChange}
              onSortingChange={onSortingChange}
              pageCount={query.data?.totalPages ?? 0}
              pagination={tableState.pagination}
              sorting={tableState.sorting}
              tableWrapperClassName='max-h-130'
              totalCount={query.data?.totalElements ?? 0}
            />
          </div>
        </BranchesPageSurface>
      </div>
      <BranchFormDialog
        onOpenChange={(open) => !open && setOpenDialog(null)}
        open={openDialog === 'create'}
      />
      <BranchFormDialog
        currentRow={currentRow}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDialog(null)
            setTimeout(() => setCurrentRow(null), 500)
          }
        }}
        open={openDialog === 'edit'}
      />
      <BranchDeleteDialog
        currentRow={currentRow}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDialog(null)
            setTimeout(() => setCurrentRow(null), 500)
          }
        }}
        open={openDialog === 'delete'}
      />
    </>
  )
}

export function BranchesPage() {
  return (
    <BranchProvider>
      <BranchesContent />
    </BranchProvider>
  )
}
