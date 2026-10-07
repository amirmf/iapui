import { applyClaimRequestQuickStatusFilter } from '@features/claim-requests'
import type { PageClaimRequest } from '@iap/api-types'
import type { ApiFilterParams } from '@iap/shared-lib'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'
import { produce } from 'immer'

import agentClaimRequestService from '../../../services/agent-claim-request-service'

export interface AgentClaimRequestsQueryParams {
  pagination: PaginationState
  filters: ApiFilterParams
}

export function buildAgentClaimRequestFilters(filters: ApiFilterParams) {
  return produce(filters, (draft) => {
    if (!draft.sort) {
      draft.sort = 'createdAt'
      draft.direction = 'asc'
    }
    const quickStatusFromFilters = draft['quickStatus'] as string | undefined
    const quickStatus = quickStatusFromFilters ?? 'IN_ASSESSMENT'
    if (quickStatus) {
      applyClaimRequestQuickStatusFilter(draft, quickStatus)
    }
  })
}

export function agentClaimRequestsQueryOptions(
  params: AgentClaimRequestsQueryParams
) {
  const { pagination, filters } = params
  return queryOptions<PageClaimRequest>({
    queryKey: ['agentClaimRequests', pagination, filters],
    queryFn: ({ signal }) =>
      agentClaimRequestService.getPage({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        filters: buildAgentClaimRequestFilters(filters),
        signal,
      }),
    staleTime: 5000,
    gcTime: 5000,
    refetchOnWindowFocus: false,
  })
}

export function useAgentClaimRequestsQuery(
  params: AgentClaimRequestsQueryParams
) {
  return useQuery(agentClaimRequestsQueryOptions(params))
}

export default useAgentClaimRequestsQuery
