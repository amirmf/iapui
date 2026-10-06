import { useEffect, useMemo, useState } from 'react'

import { useAssessmentPromptColumns } from '@features/assessment-prompts/components/assessment-prompt-columns'
import { AssessmentPromptDeleteMethodDialog } from '@features/assessment-prompts/components/assessment-prompt-delete-method-dialog'
import { AssessmentPromptFormDialog } from '@features/assessment-prompts/components/assessment-prompt-form-dialog'
import { AssessmentPromptViewDialog } from '@features/assessment-prompts/components/assessment-prompt-view-dialog'
import { AssessmentPromptsDataTableToolbar } from '@features/assessment-prompts/components/assessment-prompts-data-table-toolbar'
import AssessmentPromptProvider from '@features/assessment-prompts/context/provider/assessment-prompt-provider'
import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import {
  parseAssessmentPromptTableSearch,
  toAssessmentPromptApiFilters,
  toAssessmentPromptTableSearch,
} from '@features/assessment-prompts/route-adapters/table-search'
import { assessmentPromptService } from '@features/assessment-prompts/services/assessment-prompt-service'
import type { AssessmentPrompt } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { Button, cn } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { useTranslate } from '@shared/i18n/i18n'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import type { VisibilityState } from '@tanstack/react-table'

const EMPTY_ASSESSMENT_PROMPTS: AssessmentPrompt[] = []

const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  'agreement.code': false,
  'agreement.title': false,
}

function AssessmentPromptsContent() {
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useTableFilterQueryParams({
    parse: parseAssessmentPromptTableSearch,
    resetPageOnSortingChange: false,
    search,
    serialize: toAssessmentPromptTableSearch,
  })
  const columns = useAssessmentPromptColumns()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_COLUMN_VISIBILITY
  )
  const rowSelection = useAssessmentPrompt((state) => state.rowSelection)
  const setOpen = useAssessmentPrompt((state) => state.setOpen)
  const setRowSelection = useAssessmentPrompt((state) => state.setRowSelection)
  const apiFilters = useMemo(
    () => toAssessmentPromptApiFilters(tableState.filters, tableState.sorting),
    [tableState.filters, tableState.sorting]
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      assessmentPromptService.getPage({
        filters: apiFilters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    queryKey: ['assessment-prompts', tableState.pagination, apiFilters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
  const assessmentPrompts = query.data?.content ?? EMPTY_ASSESSMENT_PROMPTS
  const hasSelectedRows = Object.entries(rowSelection).some(
    ([rowIndex, selected]) =>
      selected && Boolean(assessmentPrompts[Number(rowIndex)]?.id)
  )
  const canBulkDelete = isSuperAdminRole(user?.roles ?? [])

  useEffect(() => {
    setRowSelection({})
  }, [
    setRowSelection,
    tableState.pagination.pageIndex,
    tableState.pagination.pageSize,
  ])

  return (
    <>
      <div className='flex flex-col gap-6'>
        <Main className='overflow-hidden'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-xl font-bold tracking-tight'>
                {t('assessmentPrompts.title')}
              </h2>
            </div>
            <div className='flex gap-2'>
              {canBulkDelete ? (
                <Button
                  disabled={!hasSelectedRows}
                  onClick={() => setOpen('bulkDelete')}
                  variant='destructive'
                  className='space-x-2'
                >
                  <IconTrash aria-hidden='true' size={18} />
                  <span>{t('assessmentPrompts.bulkDelete.button')}</span>
                </Button>
              ) : null}
              <Button
                disabled={query.isLoading}
                onClick={() => void query.refetch()}
                variant='outline'
                className='space-x-2'
              >
                <IconRefresh
                  aria-hidden='true'
                  size={18}
                  className={cn(query.isLoading && 'animate-spin')}
                />
                <span>{t('assessmentPrompts.refresh')}</span>
              </Button>
              <Button onClick={() => setOpen('create')} className='space-x-2'>
                <IconPlus aria-hidden='true' size={18} />
                <span>{t('assessmentPrompts.create')}</span>
              </Button>
            </div>
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
            <AssessmentPromptsDataTableToolbar />
            <PaginatedDataTable<AssessmentPrompt>
              columnVisibility={columnVisibility}
              columns={columns}
              data={assessmentPrompts}
              emptyStateText={t('assessmentPrompts.noPrompts')}
              enableSorting
              hasCheckboxes
              isLoading={query.isLoading}
              manualFiltering
              manualSorting
              onColumnVisibilityChange={setColumnVisibility}
              onPaginationChange={tableState.onPaginationChange}
              onRowSelectionChange={setRowSelection}
              onSortingChange={tableState.onSortingChange}
              pageCount={query.data?.totalPages ?? 0}
              pagination={tableState.pagination}
              presentation='reference'
              rowSelection={rowSelection}
              sorting={tableState.sorting}
              tableWrapperClassName='max-h-[520px]'
              totalCount={query.data?.totalElements ?? 0}
            />
          </div>
        </Main>
      </div>
      {canBulkDelete ? (
        <AssessmentPromptDeleteMethodDialog
          assessmentPrompts={assessmentPrompts}
        />
      ) : null}
      <AssessmentPromptFormDialog />
      <AssessmentPromptViewDialog />
    </>
  )
}

export function AssessmentPromptsPage() {
  return (
    <AssessmentPromptProvider>
      <AssessmentPromptsContent />
    </AssessmentPromptProvider>
  )
}
