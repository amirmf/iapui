import { useEffect, useMemo } from 'react'

import { useAgreementColumns } from '@features/agreements/components/agreement-columns'
import { AgreementDataTableToolbar } from '@features/agreements/components/agreement-data-table-toolbar'
import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import { useAgreementTableState } from '@features/agreements/route-adapters/use-agreement-table-state'
import { agreementService } from '@features/agreements/services/agreement-service'
import type { Agreement } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Button, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { PaginatedDataTable } from '@shared/tables'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const EMPTY_AGREEMENTS: Agreement[] = []

export function AgreementsSection() {
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const { filters, onPaginationChange, onSortingChange, pagination, sorting } =
    useAgreementTableState()
  const columns = useAgreementColumns()
  const rowSelection = useAgreementStore((state) => state.rowSelection)
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  const setRowSelection = useAgreementStore((state) => state.setRowSelection)
  const setSelectedAgreement = useAgreementStore(
    (state) => state.setSelectedAgreement
  )
  const query = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['agreements', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const agreements = query.data?.content ?? EMPTY_AGREEMENTS
  const selectedAgreement = useMemo(
    () =>
      Object.entries(rowSelection).flatMap(([index, selected]) =>
        selected && agreements[Number(index)] ? [agreements[Number(index)]] : []
      ),
    [agreements, rowSelection]
  )

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])
  useEffect(() => {
    setSelectedAgreement(selectedAgreement)
  }, [selectedAgreement, setSelectedAgreement])

  const canDelete =
    isSuperAdminRole(user?.roles ?? []) &&
    Object.values(rowSelection).some(Boolean)

  return (
    <main className='flex w-full flex-col rounded-[20px] bg-card px-6 py-6 text-foreground shadow-sm peer-[.header-fixed]/header:mt-16 sm:px-8 sm:py-8'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('agreements.title' as never)}
        </h2>
        <div className='flex gap-2'>
          {isSuperAdminRole(user?.roles ?? []) ? (
            <Button
              className='space-x-2 text-destructive'
              disabled={!canDelete}
              onClick={() => setOpenDialog('deleteMethod')}
              variant='outline'
            >
              <IconTrash aria-hidden='true' size={18} />
              {t('common.delete')}
            </Button>
          ) : null}
          <Button
            className='space-x-2'
            disabled={query.isLoading}
            onClick={() => void query.refetch()}
            variant='outline'
          >
            <IconRefresh
              aria-hidden='true'
              size={18}
              className={cn(query.isLoading && 'animate-spin')}
            />
            {t('agreements.refresh' as never)}
          </Button>
          <Button
            presentation='reference'
            className='space-x-2'
            onClick={() => setOpenDialog('create')}
          >
            <IconPlus aria-hidden='true' size={18} />
            {t('agreements.create' as never)}
          </Button>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <AgreementDataTableToolbar />
        <PaginatedDataTable
          columns={columns}
          data={agreements}
          emptyStateText={t('agreements.noAgreements' as never)}
          enableSorting
          hasActiveFilters={Object.keys(filters).some(
            (key) => key !== 'sort' && key !== 'direction'
          )}
          hasCheckboxes
          isLoading={query.isLoading}
          manualFiltering
          onPaginationChange={onPaginationChange}
          onRowSelectionChange={setRowSelection}
          onSortingChange={onSortingChange}
          pageCount={Math.max(query.data?.totalPages ?? 0, 1)}
          pagination={pagination}
          presentation='reference'
          rowSelection={rowSelection}
          smallPagination
          sorting={sorting}
          tableWrapperClassName='max-h-90'
          totalCount={query.data?.totalElements ?? 0}
        />
      </div>
    </main>
  )
}
