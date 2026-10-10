import { claimRequestService } from '@features/claim-requests'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function customerUserClaimRequestQueryOptions(claimRequestId: string) {
  return queryOptions({
    queryKey: ['customerUserClaimRequest', claimRequestId],
    queryFn: ({ signal }) =>
      claimRequestService.getById(claimRequestId, { signal }),
    enabled: Boolean(claimRequestId),
  })
}

export function useCustomerUserClaimRequest(claimRequestId: string) {
  return useQuery(customerUserClaimRequestQueryOptions(claimRequestId))
}
