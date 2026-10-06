import { useEffect, useMemo } from 'react'

import { AssignementRuleBulkDeleteDialog } from '@features/assignement-rules/components/assignement-rule-bulk-delete-dialog'
import { useAssignementRuleColumns } from '@features/assignement-rules/components/assignement-rule-columns'
import { AssignementRuleDataTableToolbar } from '@features/assignement-rules/components/assignement-rule-data-table-toolbar'
import { AssignementRuleDeleteDialog } from '@features/assignement-rules/components/assignement-rule-delete-dialog'
import { AssignementRuleFormDialog } from '@features/assignement-rules/components/assignement-rule-form-dialog'
import { AssignementRulesHeader } from '@features/assignement-rules/components/assignement-rules-header'
import AssignementRuleProvider from '@features/assignement-rules/context/provider/assignement-rule-provider'
import { getSelectedAssignementRuleIds } from '@features/assignement-rules/context/store/assignement-rule-row-selection'
import { useAssignementRule } from '@features/assignement-rules/context/store/assignement-rule-store'
import { useAssignementRulesData } from '@features/assignement-rules/queries/use-assignement-rules-query'
import { useAssignementRuleTableState } from '@features/assignement-rules/route-adapters/use-assignement-rule-table-state'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable } from '@shared/tables'
import { useTranslation } from 'react-i18next'

function AssignementRulesContent() {
  const { t } = useTranslation()
  const { filters, pagination, setPagination } = useAssignementRuleTableState()

  const rowSelection = useAssignementRule((state) => state.rowSelection)
  const setRowSelection = useAssignementRule((state) => state.setRowSelection)

  const {
    data: pageData,
    isLoading,
    isFetching,
    refetch,
  } = useAssignementRulesData({ filters, pagination })

  const rules = useMemo(() => pageData?.content ?? [], [pageData])
  const selectedRuleIds = useMemo(
    () => getSelectedAssignementRuleIds(rowSelection, rules),
    [rowSelection, rules]
  )

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  const columns = useAssignementRuleColumns()

  return (
    <div className='pb-4'>
      <Main>
        <AssignementRulesHeader
          selectedCount={selectedRuleIds.length}
          isLoading={isFetching}
          refetch={refetch}
        />
        <AssignementRuleDataTableToolbar />
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <PaginatedDataTable
            columns={columns}
            data={rules}
            emptyStateText={t('assignementRules.empty')}
            enableSorting={false}
            hasCheckboxes
            isLoading={isLoading}
            manualFiltering
            onPaginationChange={setPagination}
            onRowSelectionChange={setRowSelection}
            pageCount={pageData?.totalPages ?? 0}
            pagination={pagination}
            presentation='reference'
            rowSelection={rowSelection}
            tableWrapperClassName='max-h-130'
            totalCount={pageData?.totalElements ?? 0}
          />
        </div>
      </Main>
      <AssignementRuleFormDialog refetch={refetch} />
      <AssignementRuleDeleteDialog refetch={refetch} />
      <AssignementRuleBulkDeleteDialog
        ids={selectedRuleIds}
        refetch={refetch}
      />
    </div>
  )
}

export function AssignementRulesPage() {
  return (
    <AssignementRuleProvider>
      <AssignementRulesContent />
    </AssignementRuleProvider>
  )
}

export default AssignementRulesPage
