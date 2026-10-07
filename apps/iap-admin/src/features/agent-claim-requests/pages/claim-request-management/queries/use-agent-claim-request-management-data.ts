import { queryOptions, useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

import agentClaimRequestService from '../../../services/agent-claim-request-service'

export function agentClaimRequestManagementQueryOptions(
  claimRequestId: string
) {
  return queryOptions({
    queryKey: ['agentClaimRequest', claimRequestId],
    queryFn: ({ signal }) =>
      agentClaimRequestService.getById(claimRequestId, { signal }),
    staleTime: 10000,
    gcTime: 10000,
    refetchOnWindowFocus: true,
  })
}

export function useAgentClaimRequestManagementData() {
  const { claimRequestId } = useParams({
    from: '/_agent/agent/claim-requests/$claimRequestId/claim-request-management/',
  })
  return useQuery(agentClaimRequestManagementQueryOptions(claimRequestId))
}

export default useAgentClaimRequestManagementData
