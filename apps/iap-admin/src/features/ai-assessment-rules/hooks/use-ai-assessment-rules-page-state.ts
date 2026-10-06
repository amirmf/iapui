import { useEffect, useMemo } from 'react'

import {
  type TableFilterSearch,
  useTableFilterQueryParams,
} from '@shared/tables'
import { useRouterState } from '@tanstack/react-router'

import { useAiAssessmentRule } from '../context/store/ai-assessment-rule-store'
import { useAiAssessmentRulesQuery } from '../queries/use-ai-assessment-rules'
import {
  parseAiAssessmentRuleTableSearch,
  toAiAssessmentRuleApiFilters,
  toAiAssessmentRuleTableSearch,
} from '../route-adapters/table-search'

export function useAiAssessmentRulesPageState() {
  const search = useRouterState({
    select: (state) => (state.location.search ?? {}) as TableFilterSearch,
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

  const selectedIds = useMemo(() => {
    return Object.entries(rowSelection)
      .filter(([, selected]) => selected)
      .map(([index]) => rules[Number(index)]?.id)
      .filter((id): id is string => Boolean(id))
  }, [rowSelection, rules])

  const inspectedRule = useMemo(() => {
    const selectedEntries = Object.entries(rowSelection).find(
      ([, selected]) => selected
    )
    if (!selectedEntries) return undefined
    const rowIndex = Number(selectedEntries[0])
    return Number.isInteger(rowIndex) && rowIndex >= 0
      ? rules[rowIndex]
      : undefined
  }, [rowSelection, rules])

  useEffect(() => {
    setRowSelection({})
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection])

  return {
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
  }
}
