import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

export function useMyClaimRequestQuery() {
  const { id } = useParams({ strict: false })
  return useQuery({
    queryKey: ['myClaimRequest', id],
    queryFn: ({ signal }) => myClaimRequestService.getById(id!, { signal }),
    enabled: Boolean(id),
    staleTime: 5_000,
    gcTime: 5_000,
  })
}
