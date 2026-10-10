import type { MyClaimRequestsFilterValues } from '@features/my-claims/components/my-claim-requests-filter'
import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { queryOptions } from '@tanstack/react-query'

export const PAGE_SIZE = 9
export function myClaimRequestsQueryOptions(
  page: number,
  filters: MyClaimRequestsFilterValues
) {
  return queryOptions({
    queryKey: ['myClaimRequests', page, PAGE_SIZE, filters],
    queryFn: ({ signal }) =>
      myClaimRequestService.getPage({
        page,
        size: PAGE_SIZE,
        filters: { ...filters },
        signal,
      }),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    staleTime: 10 * 1000,
    gcTime: 10 * 1000,
  })
}
