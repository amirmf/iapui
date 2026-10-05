import { useCallback, useEffect, useMemo, useState } from 'react'

import { DamageCodeDeleteMethodDialog } from '@features/damage-codes/components/damage-code-dialogs/damage-code-delete-method-dialog'
import { DamageCodeFormDialog } from '@features/damage-codes/components/damage-code-dialogs/damage-code-form-dialog'
import { DamageCodeViewDialog } from '@features/damage-codes/components/damage-code-dialogs/damage-code-view-dialog'
import { useDamageCodeColumns } from '@features/damage-codes/components/damage-code-table/damage-code-columns'
import { DamageCodeDataTableTools } from '@features/damage-codes/components/damage-code-table/damage-code-data-table-tools'
import { DamageCodePricingDialog } from '@features/damage-codes/components/pricings/damage-code-pricing-dialog'
import { DamageCodePricingsSection } from '@features/damage-codes/components/pricings/damage-code-pricings-section'
import { useDamageCodeStore } from '@features/damage-codes/context/store/damage-code-store'
import {
  parseDamageCodeTableSearch,
  toDamageCodeApiFilters,
  toDamageCodeTableSearch,
} from '@features/damage-codes/queries/damage-code-table-state'
import { damageCodeService } from '@features/damage-codes/services/damage-code-service'
import type { DamageCode, DamageCodeSummary } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Button, Permission, cn } from '@iap/ui'
import { PaginatedDataTable, type TableFilterSearch } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const emptyDamageCodes: DamageCode[] = []
const resolveUpdater = <T,>(updater: Updater<T>, previous: T) =>
  typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater

export function DamageCodesPage() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useMemo(() => parseDamageCodeTableSearch(search), [search])
  const columns = useDamageCodeColumns()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const currentRow = useDamageCodeStore((state) => state.currentRow)
  const openDialog = useDamageCodeStore((state) => state.openDialog)
  const rowSelection = useDamageCodeStore((state) => state.rowSelection)
  const reset = useDamageCodeStore((state) => state.reset)
  const setCurrentRow = useDamageCodeStore((state) => state.setCurrentRow)
  const setOpenDialog = useDamageCodeStore((state) => state.setOpenDialog)
  const setRowSelection = useDamageCodeStore((state) => state.setRowSelection)
  const canManage = isSuperAdminRole(user?.roles ?? [])
  const apiFilters = useMemo(
    () => toDamageCodeApiFilters(tableState.filters, tableState.sorting),
    [tableState.filters, tableState.sorting]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      damageCodeService.getPage({
        filters: apiFilters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['damage-codes', 'page', tableState.pagination, apiFilters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const damageCodes = query.data?.content ?? emptyDamageCodes
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([index]) => damageCodes[Number(index)]?.id)
        .filter((id): id is string => Boolean(id)),
    [damageCodes, rowSelection]
  )
  const selectedDamageCode = useMemo(() => {
    const index = Object.keys(rowSelection).find((key) => rowSelection[key])
    return index === undefined ? null : (damageCodes[Number(index)] ?? null)
  }, [damageCodes, rowSelection])
  const selectedDamageCodeSummary = useMemo<DamageCodeSummary | null>(() => {
    if (!selectedDamageCode?.id) return null

    return {
      code: selectedDamageCode.code ?? undefined,
      id: selectedDamageCode.id,
      title: selectedDamageCode.title ?? undefined,
    }
  }, [selectedDamageCode])
  useEffect(() => () => reset(), [reset])
  useEffect(() => {
    setRowSelection({})
  }, [
    setRowSelection,
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
  ])
  const updateTable = useCallback(
    (
      pagination: PaginationState,
      sorting: SortingState,
      filters = tableState.filters
    ) =>
      router.navigate({
        replace: true,
        search: toDamageCodeTableSearch({
          filters,
          pagination,
          sorting,
        }) as never,
        to: './',
      }),
    [router, tableState.filters]
  )
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      updateTable(
        resolveUpdater(updater, tableState.pagination),
        tableState.sorting
      ),
    [tableState.pagination, tableState.sorting, updateTable]
  )
  const onSortingChange = useCallback(
    (updater: Updater<SortingState>) =>
      updateTable(
        tableState.pagination,
        resolveUpdater(updater, tableState.sorting)
      ),
    [tableState.pagination, tableState.sorting, updateTable]
  )
  const onFilterValuesChange = useCallback(
    (updater: (previous: TableFilterSearch) => TableFilterSearch) =>
      updateTable(
        { ...tableState.pagination, pageIndex: 0 },
        tableState.sorting,
        updater(tableState.filters)
      ),
    [tableState.filters, tableState.pagination, tableState.sorting, updateTable]
  )
  const closeCurrent = () => {
    setOpenDialog(null)
    window.setTimeout(() => setCurrentRow(null), 500)
  }
  return (
    <div className='flex flex-col gap-4 pb-4'>
      <main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('damageCodes.title')}
          </h2>
          <div className='flex gap-2'>
            <Permission hasPermission={canManage}>
              <Button
                disabled={!selectedIds.length}
                onClick={() => setOpenDialog('deleteMethod')}
                className='space-x-2 text-destructive'
                variant='outline'
              >
                <Trash2 aria-hidden='true' className='size-[18px]' />
                {t('common.delete')}
              </Button>
            </Permission>
            <Button
              className='space-x-2'
              disabled={query.isLoading}
              onClick={() => void query.refetch()}
              variant='outline'
            >
              <RefreshCw
                aria-hidden='true'
                className={cn('size-[18px]', query.isLoading && 'animate-spin')}
              />
              {t('damageCodes.refresh')}
            </Button>
            <Button
              className='space-x-2'
              onClick={() => setOpenDialog('create')}
            >
              <Plus aria-hidden='true' className='size-[18px]' />
              {t('damageCodes.create')}
            </Button>
          </div>
        </div>
        <div className='-mx-4 overflow-auto px-4 py-1'>
          <DamageCodeDataTableTools
            onValuesChange={onFilterValuesChange}
            values={tableState.filters}
          />
          <PaginatedDataTable
            columns={columns}
            columnVisibility={columnVisibility}
            data={damageCodes}
            emptyStateText={t('damageCodes.noDamageCodes')}
            enableSorting
            hasActiveFilters={Object.keys(tableState.filters).length > 0}
            hasCheckboxes
            isLoading={query.isLoading}
            manualSorting
            onPaginationChange={onPaginationChange}
            onColumnVisibilityChange={setColumnVisibility}
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
      </main>
      <DamageCodePricingsSection damageCode={selectedDamageCodeSummary} />
      <DamageCodeDeleteMethodDialog
        ids={selectedIds}
        onOpenChange={(open) => {
          if (open) return
          setOpenDialog(null)
          window.setTimeout(() => setRowSelection({}), 300)
        }}
        open={openDialog === 'deleteMethod'}
      />
      <DamageCodeFormDialog
        onOpenChange={(open) => !open && setOpenDialog(null)}
        open={openDialog === 'create'}
      />
      {currentRow ? (
        <>
          <DamageCodeFormDialog
            damageCode={currentRow}
            onOpenChange={(open) => !open && closeCurrent()}
            open={openDialog === 'edit'}
          />
          <DamageCodeViewDialog
            damageCode={currentRow}
            onOpenChange={(open) => !open && closeCurrent()}
            open={openDialog === 'view'}
          />
          <DamageCodePricingDialog
            damageCode={currentRow}
            onOpenChange={(open) => !open && closeCurrent()}
            open={openDialog === 'pricing'}
          />
        </>
      ) : null}
    </div>
  )
}
