import { RepetitiveResponseGroupDeleteMethodDialog } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-delete-method-dialog'
import RepetitiveResponseGroupDataTableToolbar from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-data-table-toolbar'
import { RepetitiveResponseGroupFormDialog } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-form-dialog'
import { RepetitiveResponseGroupViewDialog } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-view-dialog'
import { useRepetitiveResponseGroupColumns } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-columns'
import { useRepetitiveResponseGroup } from '@features/repetitive-responses/model/repetitive-response-store'
import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import { Button, cn } from '@iap/ui'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PaginationState } from '@tanstack/react-table'

const emptyGroups: never[] = []

export default function RepetitiveResponseGroups() {
  const { t } = useTranslation()
  const columns = useRepetitiveResponseGroupColumns()
  const { currentRow, open, rowSelection, setCurrentRow, setOpen, setRowSelection } = useRepetitiveResponseGroup()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 30 })
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) => repetitiveResponseGroupService.getPage({ page: pagination.pageIndex, signal, size: pagination.pageSize }),
    queryKey: ['repetitive-response-groups', 'page', pagination],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const groups = query.data?.content ?? emptyGroups
  const selectedGroup = useMemo(() => Object.entries(rowSelection).find(([, selected]) => selected)?.[0], [rowSelection])
  useEffect(() => { setRowSelection({}) }, [pagination.pageIndex, pagination.pageSize, setRowSelection])
  useEffect(() => { if (open === null && selectedGroup !== undefined) setCurrentRow(groups[Number(selectedGroup)] ?? null) }, [groups, open, selectedGroup, setCurrentRow])
  return <section>
    <div className='mb-6 flex flex-wrap items-center justify-between gap-4'><h2 className='text-xl font-bold tracking-tight'>{t('repetitiveResponseGroups.title')}</h2><div className='flex gap-2'><Button className='space-x-2 text-destructive' disabled={!Object.values(rowSelection).some(Boolean)} onClick={() => setOpen('deleteMethod')} variant='outline'><Trash2 aria-hidden='true' className='size-[18px]' />{t('common.delete')}</Button><Button className='space-x-2' disabled={query.isLoading} onClick={() => void query.refetch()} variant='outline'><RefreshCw aria-hidden='true' className={cn('size-[18px]', query.isLoading && 'animate-spin')} />{t('repetitiveResponseGroups.refresh')}</Button><Button className='space-x-2' onClick={() => setOpen('create')}><Plus aria-hidden='true' className='size-[18px]' />{t('repetitiveResponseGroups.create')}</Button></div></div>
    <div className='-mx-4 overflow-auto px-4 py-1'><RepetitiveResponseGroupDataTableToolbar /><PaginatedDataTable columns={columns} data={groups} emptyStateText={t('repetitiveResponseGroups.noGroups')} enableSorting hasCheckboxes isLoading={query.isLoading} onPaginationChange={setPagination} onRowSelectionChange={setRowSelection} pageCount={query.data?.totalPages ?? 0} pagination={pagination} rowSelection={rowSelection} tableWrapperClassName='max-h-130' totalCount={query.data?.totalElements ?? 0} /></div>
    <RepetitiveResponseGroupFormDialog onOpenChange={(next) => !next && setOpen(null)} open={open === 'create'} />
    <RepetitiveResponseGroupDeleteMethodDialog onOpenChange={(next) => !next && setOpen(null)} open={open === 'deleteMethod'} repetitiveResponseGroups={groups} rowSelection={rowSelection} />
    {currentRow ? <><RepetitiveResponseGroupFormDialog currentRow={currentRow} onOpenChange={(next) => !next && setOpen(null)} open={open === 'edit'} /><RepetitiveResponseGroupViewDialog group={currentRow} onOpenChange={(next) => !next && setOpen(null)} open={open === 'view'} /></> : null}
  </section>
}
