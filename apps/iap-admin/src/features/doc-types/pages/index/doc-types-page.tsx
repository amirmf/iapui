import { useCallback, useEffect, useMemo } from 'react'

import { useDocTypeStore } from '@features/doc-types/context/store/doc-type-store'
import { DocTypeBulkDeleteDialog } from '@features/doc-types/pages/index/components/doc-type-bulk-delete-dialog'
import { useDocTypeColumns } from '@features/doc-types/pages/index/components/doc-type-columns'
import { DocTypeDataTableToolbar } from '@features/doc-types/pages/index/components/doc-type-data-table-toolbar'
import { DocTypeDeleteDialog } from '@features/doc-types/pages/index/components/doc-type-delete-dialog'
import { DocTypeInlineEditRow } from '@features/doc-types/pages/index/components/doc-type-inline-edit-row'
import { DocTypeViewDialog } from '@features/doc-types/pages/index/components/doc-type-view-dialog'
import {
  parseDocTypeTableSearch,
  toDocTypeApiFilters,
  toDocTypeTableSearch,
} from '@features/doc-types/queries/doc-type-table-state'
import type { AdminDocType } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission, cn } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { PaginatedDataTable, type TableFilterSearch } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type {
  PaginationState,
  Row,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const EMPTY_DOC_TYPES: AdminDocType[] = []

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function DocTypesContent() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useMemo(() => parseDocTypeTableSearch(search), [search])
  const columns = useDocTypeColumns()
  const currentRow = useDocTypeStore((state) => state.currentRow)
  const editingRowId = useDocTypeStore((state) => state.editingRowId)
  const openDialog = useDocTypeStore((state) => state.openDialog)
  const rowSelection = useDocTypeStore((state) => state.rowSelection)
  const setEditingRowId = useDocTypeStore((state) => state.setEditingRowId)
  const setCurrentRow = useDocTypeStore((state) => state.setCurrentRow)
  const setOpenDialog = useDocTypeStore((state) => state.setOpenDialog)
  const setRowSelection = useDocTypeStore((state) => state.setRowSelection)
  const canManage = isSuperAdminRole(user?.roles ?? [])
  const effectiveFilters = useMemo<ApiFilterParams>(
    () => toDocTypeApiFilters(tableState.filters, tableState.sorting),
    [tableState.filters, tableState.sorting]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      docTypeService.getPage({
        filters: effectiveFilters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['doc-types', 'page', tableState.pagination, effectiveFilters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const { refetch } = query
  const docTypes = query.data?.content ?? EMPTY_DOC_TYPES
  const selectedDocTypeIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => docTypes[Number(rowId)]?.id)
        .filter((id): id is string => Boolean(id)),
    [docTypes, rowSelection]
  )

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
        search: toDocTypeTableSearch({ filters, pagination, sorting }) as never,
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
    (updater: (previous: TableFilterSearch) => TableFilterSearch) =>
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
  const renderRow = useCallback(
    (row: Row<AdminDocType>) =>
      editingRowId === row.original.id ? (
        <DocTypeInlineEditRow
          onCancel={() => setEditingRowId(null)}
          onSuccess={() => {
            setEditingRowId(null)
            void refetch()
          }}
          row={row}
        />
      ) : null,
    [editingRowId, refetch, setEditingRowId]
  )

  return (
    <>
      <div className='pb-4'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('docTypes.title')}
          </h2>
          <div className='flex gap-2'>
            <Permission hasPermission={canManage}>
              <Button
                disabled={!selectedDocTypeIds.length}
                onClick={() => setOpenDialog('bulkDelete')}
                variant='destructive'
              >
                <Trash2 aria-hidden='true' className='size-4' />
                {t('docTypes.bulkDelete.button')}
              </Button>
            </Permission>
            <Button
              disabled={query.isLoading}
              onClick={() => void refetch()}
              variant='outline'
            >
              <RefreshCw
                aria-hidden='true'
                className={cn('size-4', query.isLoading && 'animate-spin')}
              />
              {t('docTypes.refresh')}
            </Button>
            <Button
              onClick={() => router.navigate({ to: '/doc-types/create/' })}
            >
              <Plus aria-hidden='true' className='size-4' />
              {t('docTypes.create')}
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <DocTypeDataTableToolbar
            onValuesChange={onFilterValuesChange}
            values={tableState.filters}
          />
          <PaginatedDataTable<AdminDocType>
            columns={columns}
            data={docTypes}
            emptyStateText={t('docTypes.noDocTypes')}
            enableSorting
            hasActiveFilters={Object.keys(tableState.filters).length > 0}
            hasCheckboxes={canManage}
            isLoading={query.isLoading}
            manualSorting
            onPaginationChange={onPaginationChange}
            onRowSelectionChange={setRowSelection}
            onSortingChange={onSortingChange}
            pageCount={query.data?.totalPages ?? 0}
            pagination={tableState.pagination}
            renderRow={renderRow}
            rowSelection={rowSelection}
            sorting={tableState.sorting}
            tableWrapperClassName='max-h-140'
            totalCount={query.data?.totalElements ?? 0}
          />
        </div>
      </div>
      <DocTypeBulkDeleteDialog
        docTypeIds={selectedDocTypeIds}
        onSuccess={() => void refetch()}
      />
      <DocTypeDeleteDialog onSuccess={() => void refetch()} />
      {currentRow ? (
        <DocTypeViewDialog
          docType={currentRow}
          onOpenChange={(open) => {
            if (!open) {
              setOpenDialog(null)
              setTimeout(() => setCurrentRow(null), 500)
            }
          }}
          open={openDialog === 'details'}
        />
      ) : null}
    </>
  )
}

export function DocTypesPage() {
  return <DocTypesContent />
}
