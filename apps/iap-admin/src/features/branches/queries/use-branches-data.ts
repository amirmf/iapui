import type { ApiFilterParams } from '@iap/shared-lib'
import { branchService } from '@modules/branches'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'

type UseBranchesDataProps = {
  enabled?: boolean
  filters?: ApiFilterParams
  pagination: PaginationState
}

export function useBranchesData(props: UseBranchesDataProps) {
  const { enabled, filters, pagination } = props

  return useQuery({
    enabled,
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      branchService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['branches', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
}
