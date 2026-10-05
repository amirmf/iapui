import { useMemo } from 'react'

import { useBranchColumns } from '@features/branches/components/branch-columns'
import { BranchDataTableToolbar } from '@features/branches/components/branch-data-table-toolbar'
import { BranchDeleteDialog } from '@features/branches/components/branch-delete-dialog'
import { BranchFormDialog } from '@features/branches/components/branch-form-dialog'
import { BranchSyncButton } from '@features/branches/components/branch-sync-button'
import { BranchesPageSurface } from '@features/branches/components/branches-page-surface'
import { BranchProvider } from '@features/branches/context/provider/branch-provider'
import { useBranchStore } from '@features/branches/context/store/branch-store'
import { useBranchesData } from '@features/branches/queries/use-branches-data'
import {
  parseBranchTableSearch,
  toBranchApiFilters,
  toBranchTableSearch,
} from '@features/branches/route-adapters/table-search'
import type { Branch } from '@iap/api-types'
import { Button } from '@iap/ui'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useLocation } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EMPTY_BRANCHES: Branch[] = []

function BranchesContent() {
  const { t } = useTranslation()
  const location = useLocation()
  const currentRow = useBranchStore((state) => state.currentRow)
  const openDialog = useBranchStore((state) => state.openDialog)
  const setCurrentRow = useBranchStore((state) => state.setCurrentRow)
  const setOpenDialog = useBranchStore((state) => state.setOpenDialog)
  const tableState = useTableFilterQueryParams({
    parse: parseBranchTableSearch,
    search: location.search as TableFilterSearch,
    serialize: toBranchTableSearch,
  })
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
              onReset={tableState.resetFilters}
              onValuesChange={tableState.onFiltersChange}
              values={tableState.filters}
            />
            <PaginatedDataTable<Branch>
              columns={columns}
              data={branches}
              emptyStateText={t('branches.noBranches')}
              enableSorting
              isLoading={query.isLoading}
              manualSorting
              onPaginationChange={tableState.onPaginationChange}
              onSortingChange={tableState.onSortingChange}
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
