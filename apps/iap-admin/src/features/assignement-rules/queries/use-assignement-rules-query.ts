import { assignementRuleService } from '@features/assignement-rules/services/assignement-rule-service'
import type { PageAssignementRule } from '@iap/api-types'
import type { ApiFilterParams } from '@iap/shared-lib'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'

export function useAssignementRulesData({
  filters,
  pagination,
}: {
  filters?: ApiFilterParams
  pagination: PaginationState
}) {
  return useQuery<PageAssignementRule>({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      assignementRuleService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['assignement-rules', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
}
