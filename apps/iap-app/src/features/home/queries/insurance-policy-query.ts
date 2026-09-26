import { queryOptions } from '@tanstack/react-query'

import { getInsurancePolicies } from '../services/insurance-policy-service'

export const insurancePolicyQuery = queryOptions({
  gcTime: 30_000,
  queryFn: ({ signal }) => getInsurancePolicies(signal),
  queryKey: ['insurance-policies'],
  staleTime: 30_000,
})
