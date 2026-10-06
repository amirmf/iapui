import { useEffect, useMemo } from 'react'

import { Main } from '@shared/components/layout/main'
import { useTranslate } from '@shared/i18n/i18n'
import {
  PaginatedDataTable,
  type TableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useRouterState } from '@tanstack/react-router'

import { AiAssessmentRuleBulkDeleteDialog } from './components/ai-assessment-rule-bulk-delete-dialog'
import { useAiAssessmentRuleColumns } from './components/ai-assessment-rule-columns'
import { AiAssessmentRuleDeleteDialog } from './components/ai-assessment-rule-delete-dialog'
import { AiAssessmentRuleFormDialog } from './components/ai-assessment-rule-form-dialog/ai-assessment-rule-form-dialog'
import { AiAssessmentRuleInspector } from './components/ai-assessment-rule-inspector'
import { AiAssessmentRulesDataTableToolbar } from './components/ai-assessment-rules-data-table-toolbar'
import { AiAssessmentRulesTableActions } from './components/ai-assessment-rules-table-actions'
import AiAssessmentRuleProvider from './context/provider/ai-assessment-rule-provider'
import { useAiAssessmentRule } from './context/store/ai-assessment-rule-store'
import { useAiAssessmentRulesQuery } from './queries/use-ai-assessment-rules'
import {
  parseAiAssessmentRuleTableSearch,
  toAiAssessmentRuleApiFilters,
  toAiAssessmentRuleTableSearch,
} from './route-adapters/table-search'

function AiAssessmentRulesContent() {
  const { t } = useTranslate()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const { filters, onPaginationChange, onSortingChange, pagination, sorting } =
    useTableFilterQueryParams({
      parse: parseAiAssessmentRuleTableSearch,
      resetPageOnSortingChange: false,
      search,
      serialize: toAiAssessmentRuleTableSearch,
    })
  const rowSelection = useAiAssessmentRule((state) => state.rowSelection)
  const setRowSelection = useAiAssessmentRule((state) => state.setRowSelection)
  const activeSort = sorting[0]
  const request = {
    direction: activeSort
      ? activeSort.desc
        ? ('DESC' as const)
        : ('ASC' as const)
      : undefined,
    filters: toAiAssessmentRuleApiFilters(filters),
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sort: activeSort?.id,
  }
  const query = useAiAssessmentRulesQuery(request)
  const rules = useMemo(() => query.data?.content ?? [], [query.data])
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([index]) => rules[Number(index)]?.id)
        .filter((id): id is string => Boolean(id)),
    [rowSelection, rules]
  )
  const inspectedRule = useMemo(() => {
    const [firstSelectedRowIndex] =
      Object.entries(rowSelection).find(([, selected]) => selected) ?? []
    return firstSelectedRowIndex === undefined
      ? undefined
      : rules[Number(firstSelectedRowIndex)]
  }, [rowSelection, rules])
  const columns = useAiAssessmentRuleColumns()

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  return (
    <>
      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-bold tracking-tight'>
              {t('aiAssessmentRules.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('aiAssessmentRules.description')}
            </p>
          </div>
          <AiAssessmentRulesTableActions
            hasSelection={selectedIds.length > 0}
            isRefreshing={query.isFetching}
            onRefresh={() => query.refetch()}
          />
        </div>
        <div className='-mx-4 flex-1 px-4 py-1'>
          <AiAssessmentRulesDataTableToolbar />
          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] xl:grid-cols-[minmax(0,1fr)_minmax(22rem,35rem)]'>
            <div className='min-w-0 overflow-auto'>
              <PaginatedDataTable
                columns={columns}
                data={rules}
                emptyStateText={t('aiAssessmentRules.empty')}
                enableSorting
                hasCheckboxes
                isLoading={query.isLoading}
                manualSorting
                onPaginationChange={onPaginationChange}
                onRowSelectionChange={setRowSelection}
                onSortingChange={onSortingChange}
                pageCount={query.data?.totalPages ?? 0}
                pagination={pagination}
                rowSelection={rowSelection}
                sorting={sorting}
                totalCount={query.data?.totalElements ?? 0}
              />
            </div>
            <AiAssessmentRuleInspector
              onRefresh={query.refetch}
              rule={inspectedRule}
            />
          </div>
        </div>
      </Main>
      <AiAssessmentRuleFormDialog />
      <AiAssessmentRuleDeleteDialog />
      <AiAssessmentRuleBulkDeleteDialog ids={selectedIds} />
    </>
  )
}

export function AiAssessmentRulesPage() {
  return (
    <AiAssessmentRuleProvider>
      <AiAssessmentRulesContent />
    </AiAssessmentRuleProvider>
  )
}

export default AiAssessmentRulesPage
