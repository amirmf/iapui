import { useCallback, useEffect, useMemo } from 'react'

import { PersonSpecialDiseaseBulkDeleteDialog } from '@features/person-special-diseases/components/person-special-disease-bulk-delete-dialog'
import { usePersonSpecialDiseaseColumns } from '@features/person-special-diseases/components/person-special-disease-columns'
import { PersonSpecialDiseaseDeleteDialog } from '@features/person-special-diseases/components/person-special-disease-delete-dialog'
import { PersonSpecialDiseaseFormDialog } from '@features/person-special-diseases/components/person-special-disease-form-dialog'
import { usePersonSpecialDiseaseStore } from '@features/person-special-diseases/context/store/person-special-disease-store'
import {
  parsePersonSpecialDiseaseTableSearch,
  toPersonSpecialDiseaseTableSearch,
} from '@features/person-special-diseases/route-adapters/table-search'
import type { PersonSpecialDisease } from '@iap/api-types'
import { Button, cn } from '@iap/ui'
import { personSpecialDiseaseService } from '@modules/person-special-diseases'
import { useTranslate } from '@shared/i18n/i18n'
import { PaginatedDataTable, type TableFilterSearch } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type { PaginationState, Updater } from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'

const EMPTY_PERSON_SPECIAL_DISEASES: PersonSpecialDisease[] = []

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export function PersonSpecialDiseasesPage() {
  const { t } = useTranslate()
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useMemo(
    () => parsePersonSpecialDiseaseTableSearch(search),
    [search]
  )
  const columns = usePersonSpecialDiseaseColumns()
  const rowSelection = usePersonSpecialDiseaseStore(
    (state) => state.rowSelection
  )
  const setOpenDialog = usePersonSpecialDiseaseStore(
    (state) => state.setOpenDialog
  )
  const setRowSelection = usePersonSpecialDiseaseStore(
    (state) => state.setRowSelection
  )
  const filters = tableState.filters
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      personSpecialDiseaseService.getPage({
        filters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['person-special-diseases', tableState.pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const rows = query.data?.content ?? EMPTY_PERSON_SPECIAL_DISEASES

  useEffect(() => () => usePersonSpecialDiseaseStore.getState().reset(), [])

  const updateTableState = useCallback(
    (pagination: PaginationState) => {
      router.navigate({
        replace: true,
        search: toPersonSpecialDiseaseTableSearch({
          filters: tableState.filters,
          pagination,
        }) as never,
        to: './',
      })
    },
    [router, tableState.filters]
  )
  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) =>
      updateTableState(resolveUpdater(updater, tableState.pagination)),
    [tableState.pagination, updateTableState]
  )

  return (
    <>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>
          {t('personSpecialDiseases.title')}
        </h2>
        <div className='flex gap-2'>
          <Button
            disabled={query.isLoading}
            onClick={() => void query.refetch()}
            variant='outline'
          >
            <RefreshCw
              aria-hidden='true'
              className={cn('size-4', query.isLoading && 'animate-spin')}
            />
            {t('claimRequests.refresh')}
          </Button>
          <Button
            disabled={Object.keys(rowSelection).length === 0}
            onClick={() => setOpenDialog('bulkDelete')}
            variant='destructive'
          >
            <Trash2 aria-hidden='true' className='size-4' />
            {t('personSpecialDiseases.actions.delete')}
          </Button>
          <Button onClick={() => setOpenDialog('create')}>
            <Plus aria-hidden='true' className='size-4' />
            {t('personSpecialDiseases.actions.create')}
          </Button>
        </div>
      </div>
      <PaginatedDataTable
        columns={columns}
        data={rows}
        emptyStateText={t('personSpecialDiseases.emptyState')}
        enableSorting={false}
        hasCheckboxes
        isLoading={query.isLoading}
        manualFiltering
        onPaginationChange={onPaginationChange}
        onRowSelectionChange={setRowSelection}
        pageCount={query.data?.totalPages ?? 0}
        pagination={tableState.pagination}
        rowSelection={rowSelection}
        totalCount={query.data?.totalElements ?? 0}
      />
      <PersonSpecialDiseaseFormDialog refetch={query.refetch} />
      <PersonSpecialDiseaseDeleteDialog refetch={query.refetch} />
      <PersonSpecialDiseaseBulkDeleteDialog
        refetch={query.refetch}
        rows={rows}
      />
    </>
  )
}
