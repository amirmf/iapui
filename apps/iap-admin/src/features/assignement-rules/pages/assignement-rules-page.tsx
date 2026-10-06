import { useCallback, useEffect, useMemo } from 'react'

import { Button } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { PaginatedDataTable, type TableFilterSearch } from '@shared/tables'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import type { PaginationState, Updater } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { AssignementRuleBulkDeleteDialog } from '../components/assignement-rule-bulk-delete-dialog'
import { useAssignementRuleColumns } from '../components/assignement-rule-columns'
import { AssignementRuleDataTableToolbar } from '../components/assignement-rule-data-table-toolbar'
import { AssignementRuleDeleteDialog } from '../components/assignement-rule-delete-dialog'
import { AssignementRuleFormDialog } from '../components/assignement-rule-form-dialog'
import AssignementRuleProvider, {
  useAssignementRule,
} from '../context/assignement-rule-context'
import { useAssignementRulesData } from '../hooks/use-assignement-rules-data'
import {
  parseAssignementRuleTableSearch,
  toAssignementRuleTableSearch,
} from '../route-adapters/table-search'

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(previous)
    : updater
}

function AssignementRulesContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const search = useRouterState({
    select: (state) => state.location.search as TableFilterSearch,
  })
  const tableState = useMemo(
    () => parseAssignementRuleTableSearch(search),
    [search]
  )
  const pagination = tableState.pagination
  const filters = tableState.filters

  const setOpen = useAssignementRule((state) => state.setOpen)
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)
  const rowSelection = useAssignementRule((state) => state.rowSelection)
  const setRowSelection = useAssignementRule((state) => state.setRowSelection)

  const {
    data: pageData,
    isLoading,
    refetch,
  } = useAssignementRulesData({ filters, pagination })

  const rules = useMemo(() => pageData?.content ?? [], [pageData])
  const selectedRuleIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([rowId]) => rules[Number(rowId)]?.id)
        .filter((id): id is string => Boolean(id)),
    [rowSelection, rules]
  )

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  const setPagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = resolveUpdater(updater, pagination)
      router.navigate({
        replace: true,
        search: toAssignementRuleTableSearch({
          filters,
          pagination: next,
        }) as never,
        to: './',
      })
    },
    [filters, pagination, router]
  )

  const columns = useAssignementRuleColumns()

  return (
    <div className='pb-4'>
      <Main>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-xl font-bold tracking-tight'>
            {t('assignementRules.title')}
          </h2>
          <div className='flex gap-2'>
            <Button
              className='space-x-2'
              disabled={selectedRuleIds.length === 0}
              onClick={() => setOpen('bulkDelete')}
              variant='destructive'
            >
              <IconTrash size={18} />
              <span>{t('assignementRules.bulkDelete.button')}</span>
            </Button>
            <Button
              className='space-x-2'
              disabled={isLoading}
              onClick={() => void refetch()}
              variant='outline'
            >
              <IconRefresh
                className={isLoading ? 'animate-spin' : ''}
                size={18}
              />
              <span>{t('assignementRules.actions.refresh')}</span>
            </Button>
            <Button
              className='space-x-2'
              onClick={() => {
                setCurrentRow(null)
                setOpen('create')
              }}
            >
              <IconPlus size={18} />
              <span>{t('assignementRules.actions.create')}</span>
            </Button>
          </div>
        </div>
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
