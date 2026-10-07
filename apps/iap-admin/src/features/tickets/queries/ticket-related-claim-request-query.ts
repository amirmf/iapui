import { claimRequestService } from '@features/claim-requests'
import { queryOptions } from '@tanstack/react-query'

export function ticketRelatedClaimRequestQueryOptions(
  claimRequestId: string | undefined,
  isOpen: boolean
) {
  return queryOptions({
    queryKey: ['claimRequest', claimRequestId],
    queryFn: ({ signal }) =>
      claimRequestService.getById(claimRequestId!, { signal }),
    enabled: isOpen && Boolean(claimRequestId),
  })
}
