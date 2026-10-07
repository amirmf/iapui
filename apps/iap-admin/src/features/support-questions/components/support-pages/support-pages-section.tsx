import { useMemo, useState } from 'react'

import { type SupportPage } from '@iap/api-types'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { type PaginationState, type SortingState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { SupportPageProvider } from '../../context'
import { supportPageService } from '../../services'
import { useSupportPageColumns } from './support-page-columns'
import { SupportPageDeleteDialog } from './support-page-delete-dialog'
import { SupportPageFormDialog } from './support-page-form-dialog'
import { SupportPageTableActions } from './support-page-table-actions'

function SupportPagesContent() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const sort = sorting[0]
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['support-pages', pagination, sort],
    queryFn: ({ signal }) =>
      supportPageService.getPage({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        filters: {},
        sort: sort?.id ?? 'createdAt',
        direction: sort?.desc ? 'DESC' : 'ASC',
        signal,
      }),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
  const supportPages = useMemo<SupportPage[]>(
    () => (data?.content ?? []) as SupportPage[],
    [data]
  )
  const columns = useSupportPageColumns()

  return (
    <>
      <Main className='overflow-hidden'>
        <section>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-xl font-bold tracking-tight'>
              {t('supportPages.title' as never)}
            </h2>
            <SupportPageTableActions isLoading={isLoading} refetch={refetch} />
          </div>
          <PaginatedDataTable
            columns={columns}
            data={supportPages}
            isLoading={isLoading}
            pageCount={data?.totalPages ?? 0}
            totalCount={data?.totalElements ?? 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            manualSorting
            enableSorting
            smallPagination
            emptyStateText={t('supportPages.empty' as never)}
            tableWrapperClassName='max-h-96'
          />
        </section>
      </Main>
      <SupportPageFormDialog refetch={refetch} />
      <SupportPageDeleteDialog refetch={refetch} />
    </>
  )
}

export function SupportPagesSection() {
  return (
    <SupportPageProvider>
      <SupportPagesContent />
    </SupportPageProvider>
  )
}
