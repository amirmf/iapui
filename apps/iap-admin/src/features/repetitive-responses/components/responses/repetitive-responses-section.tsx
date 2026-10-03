import { useEffect, useMemo, useState } from 'react'

import { useRepetitiveResponseColumns } from '@features/repetitive-responses/components/responses/repetitive-response-columns'
import RepetitiveResponseDataTableToolbar from '@features/repetitive-responses/components/responses/repetitive-response-data-table-toolbar'
import { RepetitiveResponseDeleteMethodDialog } from '@features/repetitive-responses/components/responses/repetitive-response-delete-method-dialog'
import { RepetitiveResponseFormDialog } from '@features/repetitive-responses/components/responses/repetitive-response-form-dialog'
import { RepetitiveResponseViewDialog } from '@features/repetitive-responses/components/responses/repetitive-response-view-dialog'
import {
  useRepetitiveResponse,
  useRepetitiveResponseGroup,
} from '@features/repetitive-responses/model/repetitive-response-store'
import { repetitiveResponseService } from '@features/repetitive-responses/services/repetitive-response-service'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Button, Permission, cn } from '@iap/ui'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const emptyResponses: never[] = []
export default function RepetitiveResponsesSection() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const columns = useRepetitiveResponseColumns()
  const { currentRow, open, setCurrentRow, setOpen } = useRepetitiveResponse()
  const group = useRepetitiveResponseGroup()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const search = useRouterState({
    select: (state) => state.location.search as Record<string, unknown>,
  })
  const groupId = useMemo(
    () =>
      Object.entries(group.rowSelection).find(([, selected]) => selected)?.[0]
        ? group.currentRow?.id
        : undefined,
    [group.currentRow?.id, group.rowSelection]
  )
  const filters = useMemo(
    () => ({
      description:
        typeof search.description === 'string' ? search.description : undefined,
      repetitiveResponseGroupId: groupId,
      title: typeof search.title === 'string' ? search.title : undefined,
    }),
    [groupId, search.description, search.title]
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      repetitiveResponseService.getPageFull({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['repetitive-responses', 'page', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const responses = query.data?.content ?? emptyResponses
  const canManage = isSuperAdminRole(user?.roles ?? [])
  const selectedResponse = useMemo(() => {
    const index = Object.entries(rowSelection).find(
      ([, selected]) => selected
    )?.[0]
    return index === undefined ? null : (responses[Number(index)] ?? null)
  }, [responses, rowSelection])
  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize])
  const openDelete = () => {
    if (selectedResponse) {
      setCurrentRow(selectedResponse)
      setOpen('deleteMethod')
    }
  }
  return (
    <section className='mt-10'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('repetitiveResponses.title')}
        </h2>
        <div className='flex gap-2'>
          <Permission hasPermission={canManage}>
            <Button
              className='space-x-2 text-destructive'
              disabled={!Object.values(rowSelection).some(Boolean)}
              onClick={openDelete}
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
            {t('repetitiveResponses.refresh')}
          </Button>
          <Button
            className='space-x-2'
            disabled={!groupId}
            onClick={() => setOpen('create')}
          >
            <Plus aria-hidden='true' className='size-[18px]' />
            {t('repetitiveResponses.create')}
          </Button>
        </div>
      </div>
      <div className='-mx-4 overflow-auto px-4 py-1'>
        <RepetitiveResponseDataTableToolbar />
        <PaginatedDataTable
          columns={columns}
          data={responses}
          emptyStateText={t('repetitiveResponses.noRepetitiveResponses')}
          enableSorting
          hasCheckboxes
          isLoading={query.isLoading}
          manualFiltering
          onPaginationChange={setPagination}
          onRowSelectionChange={setRowSelection}
          onSortingChange={setSorting}
          pageCount={query.data?.totalPages ?? 0}
          pagination={pagination}
          rowSelection={rowSelection}
          sorting={sorting}
          tableWrapperClassName='max-h-60'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>
      <RepetitiveResponseFormDialog />
      <RepetitiveResponseDeleteMethodDialog
        onOpenChange={(next) => {
          if (!next) {
            setOpen(null)
            window.setTimeout(() => setRowSelection({}), 300)
          }
        }}
        open={open === 'deleteMethod'}
        repetitiveResponses={responses}
        rowSelection={rowSelection}
      />
      {currentRow ? (
        <RepetitiveResponseViewDialog
          onOpenChange={(next) => {
            if (!next) {
              setOpen(null)
              window.setTimeout(() => setCurrentRow(null), 500)
            }
          }}
          open={open === 'view'}
          repetitiveResponse={currentRow}
        />
      ) : null}
    </section>
  )
}
