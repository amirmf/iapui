import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRepetitiveResponseGroup } from '@features/repetitive-responses/model/repetitive-response-store'
import { useRepetitiveResponseGroupColumns } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-columns'
import RepetitiveResponseGroupDataTableToolbar from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-data-table-toolbar'
import { RepetitiveResponseGroupDeleteMethodDialog } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-delete-method-dialog'
import { RepetitiveResponseGroupFormDialog } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-form-dialog'
import { RepetitiveResponseGroupViewDialog } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-view-dialog'
import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import type { RepetitiveResponseGroup } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import type { ApiFilterParams } from '@iap/shared-lib'
import { Button, Permission, cn } from '@iap/ui'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import type {
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const emptyGroups: RepetitiveResponseGroup[] = []

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

export default function RepetitiveResponseGroups() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const columns = useRepetitiveResponseGroupColumns()
  const {
    currentRow,
    open,
    rowSelection,
    setCurrentRow,
    setOpen,
    setRowSelection,
  } = useRepetitiveResponseGroup()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const search = useRouterState({ select: (state) => state.location.search })
  const filters = useMemo<ApiFilterParams>(() => {
    const title = typeof search.title === 'string' ? search.title : undefined
    const [sort] = sorting

    return {
      ...(title ? { title } : {}),
      ...(sort ? { direction: sort.desc ? 'desc' : 'asc', sort: sort.id } : {}),
    }
  }, [search.title, sorting])
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      repetitiveResponseGroupService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['repetitive-response-groups', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const groups = query.data?.content ?? emptyGroups
  const selectedGroup = useMemo(() => {
    const [firstSelectedIndex] = Object.keys(rowSelection)

    if (!firstSelectedIndex) return null

    return groups[Number(firstSelectedIndex)] ?? null
  }, [groups, rowSelection])
  const canDelete = isSuperAdminRole(user?.roles ?? [])

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])
  useEffect(() => {
    if (open === null) setCurrentRow(selectedGroup)
  }, [open, selectedGroup, setCurrentRow])

  const onPaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      setPagination((previous) => resolveUpdater(updater, previous))
    },
    []
  )
  const onSortingChange = useCallback((updater: Updater<SortingState>) => {
    setSorting((previous) => resolveUpdater(updater, previous))
  }, [])

  return (
    <section>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('repetitiveResponseGroups.title')}
        </h2>
        <div className='flex gap-2'>
          <Permission hasPermission={canDelete}>
            <Button
              className='space-x-2 text-destructive'
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => {
                if (Object.keys(rowSelection).length > 0) {
                  setOpen('deleteMethod')
                }
              }}
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
            {t('repetitiveResponseGroups.refresh')}
          </Button>
          <Button className='space-x-2' onClick={() => setOpen('create')}>
            <Plus aria-hidden='true' className='size-[18px]' />
            {t('repetitiveResponseGroups.create')}
          </Button>
        </div>
      </div>

      <div className='-mx-4 overflow-auto px-4 py-1'>
        <RepetitiveResponseGroupDataTableToolbar />
        <PaginatedDataTable
          columns={columns}
          data={groups}
          emptyStateText={t('repetitiveResponseGroups.noGroups')}
          enableSorting
          hasCheckboxes
          isLoading={query.isLoading}
          manualFiltering
          onPaginationChange={onPaginationChange}
          onRowSelectionChange={setRowSelection}
          onSortingChange={onSortingChange}
          pageCount={query.data?.totalPages ?? 0}
          pagination={pagination}
          rowSelection={rowSelection}
          sorting={sorting}
          tableWrapperClassName='max-h-130'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>

      <RepetitiveResponseGroupFormDialog
        onOpenChange={(next) => !next && setOpen(null)}
        open={open === 'create'}
      />
      <RepetitiveResponseGroupDeleteMethodDialog
        onOpenChange={(next) => !next && setOpen(null)}
        open={open === 'deleteMethod'}
        repetitiveResponseGroups={groups}
        rowSelection={rowSelection}
      />
      {currentRow ? (
        <>
          <RepetitiveResponseGroupFormDialog
            currentRow={currentRow}
            onOpenChange={(next) => !next && setOpen(null)}
            open={open === 'edit'}
          />
          <RepetitiveResponseGroupViewDialog
            group={currentRow}
            onOpenChange={(next) => !next && setOpen(null)}
            open={open === 'view'}
          />
        </>
      ) : null}
    </section>
  )
}
