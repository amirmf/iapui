import { bankAccountService } from '@features/bank-accounts/services/bank-account-service'
import type { ApiFilterParams } from '@iap/shared-lib'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState } from '@tanstack/react-table'

export function useBankAccountsData(props: {
  filters: ApiFilterParams
  pagination: PaginationState
}) {
  const { filters, pagination } = props

  return useQuery({
    gcTime: 5_000,
    queryFn: ({ signal }) =>
      bankAccountService.getPage({
        filters,
        page: pagination.pageIndex,
        signal,
        size: pagination.pageSize,
      }),
    queryKey: ['bankAccounts', pagination, filters],
    refetchOnWindowFocus: false,
    staleTime: 5_000,
  })
}
