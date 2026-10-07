import type { PageSubUser, SubUser } from '@iap/api-types'
import type { ApiFilterParams } from '@iap/shared-lib'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'

import { subUserService } from '../services/sub-user-service'

export function useSubUsersPageQuery({
  filters,
  pagination,
}: {
  filters?: ApiFilterParams
  pagination: PaginationState
}) {
  return useQuery<PageSubUser>({
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      subUserService.listPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['sub-users', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
}

export function useSubUserByIdQuery(id: string | null | undefined) {
  return useQuery<SubUser>({
    enabled: !!id,
    queryFn: ({ signal }) => subUserService.getById(id!, signal),
    queryKey: ['sub-user', id],
  })
}
