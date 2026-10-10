import { insurancePolicyService } from '@features/my-claims/services/insurance-policy-service'
import { useQuery } from '@tanstack/react-query'

function useGetMyInsurancePolicy() {
  return useQuery({
    queryKey: ['insurancePolicies'],
    queryFn: () => insurancePolicyService.getAll(),
    staleTime: 30 * 1000,
    gcTime: 30 * 1000,
  })
}

export default useGetMyInsurancePolicy
