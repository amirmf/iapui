import { useEffect, useMemo } from 'react'

import { agreementService } from '@features/agreements'
import type { Agreement } from '@iap/api-types'
import { Button } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable, useTableFilterState } from '@shared/tables'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useSubUsersAgreementsStore } from '../context/store/sub-users-agreements-store'
import { useSubUsersAgreementsColumns } from './sub-users-agreements-columns'
import { SubUsersAgreementsDataTableToolbar } from './sub-users-agreements-data-table-toolbar'

const EMPTY_AGREEMENTS: Agreement[] = []

export function SubUsersAgreementsSection() {
  const { t } = useTranslation()
  const columns = useSubUsersAgreementsColumns()
  const rowSelection = useSubUsersAgreementsStore((state) => state.rowSelection)
  const setRowSelection = useSubUsersAgreementsStore(
    (state) => state.setRowSelection
  )
  const setSelectedAgreement = useSubUsersAgreementsStore(
    (state) => state.setSelectedAgreement
  )

  const {
    filters,
    onFiltersChange,
    onPaginationChange,
    pagination,
    resetFilters,
  } = useTableFilterState({
    filters: {},
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
  })

  const {
    data: pageData,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['sub-users', 'agreements', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  const agreements = pageData?.content ?? EMPTY_AGREEMENTS
  const totalCount = pageData?.totalElements ?? 0

  const selectedAgreement = useMemo<Agreement[]>(() => {
    const result: Agreement[] = []
    const selectedIndices = Object.keys(rowSelection)
      .map(Number)
      .filter((index) => rowSelection[index])

    for (const index of selectedIndices) {
      const item = agreements[index]
      if (item) {
        result.push(item)
      }
    }

    return result
  }, [agreements, rowSelection])

  useEffect(() => {
    setSelectedAgreement(selectedAgreement)
  }, [selectedAgreement, setSelectedAgreement])

  return (
    <Main className='sm:px-4 sm:py-4'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('agreements.title')}
        </h2>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isLoading || isFetching}
            onClick={() => refetch()}
            variant='outline'
          >
            <IconRefresh
              className={`mr-2 size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {t('subUsers.actions.refresh')}
          </Button>
        </div>
      </div>

      <SubUsersAgreementsDataTableToolbar
        onReset={resetFilters}
        onValuesChange={onFiltersChange}
        values={filters}
      />

      <PaginatedDataTable
        columns={columns}
        data={agreements}
        emptyStateText={t('agreements.noAgreements')}
        hasCheckboxes
        isLoading={isLoading}
        onPaginationChange={onPaginationChange}
        onRowSelectionChange={setRowSelection}
        pageCount={Math.max(1, pageData?.totalPages ?? 1)}
        pagination={pagination}
        rowSelection={rowSelection}
        smallPagination
        tableWrapperClassName='max-h-90'
        totalCount={totalCount}
      />
    </Main>
  )
}
