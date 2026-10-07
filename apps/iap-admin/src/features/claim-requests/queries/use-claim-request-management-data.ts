import { useClaimRequestManagementParams } from '@features/claim-requests/route-adapters/use-claim-request-management-params'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function claimRequestManagementQueryOptions(claimRequestId: string) {
  return queryOptions({
    queryKey: ['claimRequest', claimRequestId] as const,
    queryFn: ({ signal }) =>
      claimRequestService.getById(claimRequestId, { signal }),
    staleTime: 10000,
    gcTime: 10000,
    refetchOnWindowFocus: true,
  })
}

function useClaimRequestManagementData() {
  const { claimRequestId } = useClaimRequestManagementParams()
  return useQuery(claimRequestManagementQueryOptions(claimRequestId))
}

export default useClaimRequestManagementData
