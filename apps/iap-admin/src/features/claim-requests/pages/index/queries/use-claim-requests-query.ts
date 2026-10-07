import { useMemo } from 'react'

import { toClaimRequestApiFilters } from '@features/claim-requests/pages/index/route-adapters/claim-request-filters'
import type { ClaimRequestTableSearchState } from '@features/claim-requests/pages/index/route-adapters/table-search'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import type { TableFilterSearch } from '@shared/tables'
import { useQuery } from '@tanstack/react-query'

export function useClaimRequestsQuery(
  tableState: ClaimRequestTableSearchState,
  isDoctor: boolean,
  apiFilterSearch: TableFilterSearch
) {
  const effectiveFilters = useMemo(
    () => toClaimRequestApiFilters(apiFilterSearch, isDoctor),
    [isDoctor, apiFilterSearch]
  )
  const query = useQuery({
    queryFn: ({ signal }) =>
      claimRequestService.getPageLite({
        filters: effectiveFilters,
        page: tableState.pagination.pageIndex,
        signal,
        size: tableState.pagination.pageSize,
      }),
    gcTime: 5_000,
    queryKey: ['claimRequests', tableState.pagination, effectiveFilters],
    refetchOnWindowFocus: false,
    staleTime: 5_000,
  })
  return { query, effectiveFilters }
}
