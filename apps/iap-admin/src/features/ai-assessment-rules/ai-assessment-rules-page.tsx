import { Main } from '@shared/components/layout/main'
import { useTranslate } from '@shared/i18n/i18n'
import { PaginatedDataTable } from '@shared/tables'

import { AiAssessmentRuleBulkDeleteDialog } from './components/ai-assessment-rule-bulk-delete-dialog'
import { useAiAssessmentRuleColumns } from './components/ai-assessment-rule-columns'
import { AiAssessmentRuleDeleteDialog } from './components/ai-assessment-rule-delete-dialog'
import { AiAssessmentRuleFormDialog } from './components/ai-assessment-rule-form-dialog/ai-assessment-rule-form-dialog'
import { AiAssessmentRuleInspector } from './components/ai-assessment-rule-inspector'
import { AiAssessmentRulesDataTableToolbar } from './components/ai-assessment-rules-data-table-toolbar'
import { AiAssessmentRulesTableActions } from './components/ai-assessment-rules-table-actions'
import AiAssessmentRuleProvider from './context/provider/ai-assessment-rule-provider'
import { useAiAssessmentRulesPageState } from './hooks/use-ai-assessment-rules-page-state'

function AiAssessmentRulesContent() {
  const { t } = useTranslate()
  const columns = useAiAssessmentRuleColumns()
  const {
    inspectedRule,
    onPaginationChange,
    onSortingChange,
    pagination,
    query,
    rowSelection,
    rules,
    selectedIds,
    setRowSelection,
    sorting,
  } = useAiAssessmentRulesPageState()

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
