import { useMemo, useState } from 'react'

import { type SupportFeature } from '@iap/api-types'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { type PaginationState, type SortingState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { SupportFeatureProvider } from '../../context'
import { supportFeatureService } from '../../services'
import { useSupportFeatureColumns } from './support-feature-columns'
import { SupportFeatureDeleteDialog } from './support-feature-delete-dialog'
import { SupportFeatureFormDialog } from './support-feature-form-dialog'
import { SupportFeatureTableActions } from './support-feature-table-actions'

function SupportFeaturesContent() {
  const { t } = useTranslation()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const sort = sorting[0]
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['support-features', pagination, sort],
    queryFn: ({ signal }) =>
      supportFeatureService.getPage({
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
  const supportFeatures = useMemo<SupportFeature[]>(
    () => (data?.content ?? []) as SupportFeature[],
    [data]
  )
  const columns = useSupportFeatureColumns()

  return (
    <>
      <Main className='overflow-hidden'>
        <section>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-xl font-bold tracking-tight'>
              {t('supportFeatures.title' as never)}
            </h2>
            <SupportFeatureTableActions
              isLoading={isLoading}
              refetch={refetch}
            />
          </div>
          <PaginatedDataTable
            columns={columns}
            data={supportFeatures}
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
            emptyStateText={t('supportFeatures.empty' as never)}
            tableWrapperClassName='max-h-96'
          />
        </section>
      </Main>
      <SupportFeatureFormDialog refetch={refetch} />
      <SupportFeatureDeleteDialog refetch={refetch} />
    </>
  )
}

export function SupportFeaturesSection() {
  return (
    <SupportFeatureProvider>
      <SupportFeaturesContent />
    </SupportFeatureProvider>
  )
}
