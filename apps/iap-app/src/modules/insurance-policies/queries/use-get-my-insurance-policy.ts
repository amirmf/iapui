import { useQuery } from '@tanstack/react-query'

import { insurancePolicyService } from '../services/insurance-policy-service'

export function useGetMyInsurancePolicy() {
  return useQuery({
    gcTime: 30 * 1000,
    queryFn: ({ signal }) => insurancePolicyService.getAll(signal),
    queryKey: ['insurancePolicies'],
    staleTime: 30 * 1000,
  })
}

export default useGetMyInsurancePolicy
