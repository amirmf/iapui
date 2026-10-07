import { useEffect, useMemo } from 'react'

import { type PageSupportQuestion, type SupportQuestion } from '@iap/api-types'
import { Main } from '@shared/components/layout/main'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  parseTableFilterSearch,
  toTableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useSupportQuestion } from '../../context'
import { supportQuestionService } from '../../services'
import { SupportQuestionBulkDeleteDialog } from './support-question-bulk-delete-dialog'
import { useSupportQuestionColumns } from './support-question-columns'
import { SupportQuestionDeleteDialog } from './support-question-delete-dialog'
import { SupportQuestionFormDialog } from './support-question-form-dialog'
import { SupportQuestionTableActions } from './support-question-table-actions'
import { SupportQuestionViewDialog } from './support-question-view-dialog'
import { SupportQuestionsDataTableToolbar } from './support-questions-data-table-toolbar'

export function SupportQuestionsSection() {
  const { t } = useTranslation()
  const open = useSupportQuestion((state) => state.open)
  const setCurrentRow = useSupportQuestion((state) => state.setCurrentRow)
  const rowSelection = useSupportQuestion((state) => state.rowSelection)
  const setRowSelection = useSupportQuestion((state) => state.setRowSelection)
  const columns = useSupportQuestionColumns()

  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })

  const tableState = useTableFilterQueryParams({
    parse: parseTableFilterSearch,
    search,
    serialize: toTableFilterSearch,
  })

  const sort = tableState.sorting[0]

  const {
    data: pageData,
    isLoading,
    refetch,
  } = useQuery<PageSupportQuestion>({
    queryKey: [
      'support-questions',
      tableState.pagination,
      tableState.filters,
      sort,
    ],
    queryFn: ({ signal }) =>
      supportQuestionService.getPageFull({
        page: tableState.pagination.pageIndex,
        size: tableState.pagination.pageSize,
        filters: tableState.filters as Record<string, string | string[]>,
        sort: sort?.id ? sort.id : 'createdAt',
        direction: sort ? (sort.desc ? 'DESC' : 'ASC') : 'desc',
        signal,
      }),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  const supportQuestions = useMemo<SupportQuestion[]>(
    () => (pageData?.content ?? []) as SupportQuestion[],
    [pageData]
  )

  const selectedSupportQuestionIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => supportQuestions[Number(rowId)]?.id)
        .filter((id): id is string => Boolean(id)),
    [rowSelection, supportQuestions]
  )

  useEffect(() => {
    if (!open) setCurrentRow(null)
  }, [open, setCurrentRow])

  useEffect(() => {
    setRowSelection({})
  }, [
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
    setRowSelection,
  ])

  return (
    <>
      <Main className='overflow-hidden'>
        <section>
          <div className='mb-6'>
            <h2 className='text-xl font-bold tracking-tight'>
              {t('supportQuestions.title' as never)}
            </h2>
          </div>
          <div className='py-1'>
            <SupportQuestionTableActions
              selectedSupportQuestionIds={selectedSupportQuestionIds}
              isLoading={isLoading}
              onRefetch={refetch}
            />
            <SupportQuestionsDataTableToolbar />
            <PaginatedDataTable
              columns={columns}
              data={supportQuestions}
              isLoading={isLoading}
              pageCount={pageData?.totalPages ?? 0}
              totalCount={pageData?.totalElements ?? 0}
              pagination={tableState.pagination}
              onPaginationChange={tableState.onPaginationChange}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              sorting={tableState.sorting}
              onSortingChange={tableState.onSortingChange}
              emptyStateText={t('supportQuestions.noQuestions' as never)}
              enableSorting
              manualSorting
              hasCheckboxes
              tableWrapperClassName='max-h-130'
            />
          </div>
        </section>
      </Main>
      <SupportQuestionBulkDeleteDialog
        supportQuestionIds={selectedSupportQuestionIds}
        refetch={refetch}
      />
      <SupportQuestionFormDialog refetch={refetch} />
      <SupportQuestionViewDialog />
      <SupportQuestionDeleteDialog refetch={refetch} />
    </>
  )
}
