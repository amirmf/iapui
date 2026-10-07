import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { useQuery } from '@tanstack/react-query'

interface UseClaimRequestDuplicateTargetParams {
  claimRequestId: string | null | undefined
  enabled: boolean
  isAgentPanel: boolean
}

export function useClaimRequestDuplicateTarget(
  params: UseClaimRequestDuplicateTargetParams
) {
  const { claimRequestId, enabled } = params
  return useQuery({
    queryKey: ['claimRequest', claimRequestId],
    queryFn: ({ signal }) => {
      if (!claimRequestId)
        throw new Error('A target claim request ID is required.')
      return claimRequestService.findById(claimRequestId, signal)
    },
    enabled: enabled && Boolean(claimRequestId),
  })
}
