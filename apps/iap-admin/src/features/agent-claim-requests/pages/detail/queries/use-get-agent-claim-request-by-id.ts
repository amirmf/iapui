import { agentClaimRequestService } from '@features/agent-claim-requests/services/agent-claim-request-service'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

export function agentClaimRequestDetailQueryOptions(claimRequestId: string) {
  return queryOptions({
    queryKey: ['agentClaimRequest', claimRequestId],
    queryFn: ({ signal }) =>
      agentClaimRequestService.getById(claimRequestId, { signal }),
    enabled: !!claimRequestId,
    staleTime: 5000,
    gcTime: 5000,
  })
}

export default function useGetAgentClaimRequestById() {
  const { claimRequestId } = useParams({
    from: '/_agent/agent/claim-requests/$claimRequestId/',
  })
  return useQuery(agentClaimRequestDetailQueryOptions(claimRequestId))
}
