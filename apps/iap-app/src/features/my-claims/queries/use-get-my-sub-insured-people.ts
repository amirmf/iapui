import { subInsuredPersonService } from '@features/my-claims/services/sub-insured-person-service'
import { useQuery } from '@tanstack/react-query'

interface UseGetMySubInsuredPeopleProps {
  policyId?: number
}

function useGetMySubInsuredPeople({ policyId }: UseGetMySubInsuredPeopleProps) {
  return useQuery({
    queryKey: ['subInsuredPeople', policyId],
    queryFn: () => (policyId ? subInsuredPersonService.getAll(policyId) : null),
    enabled: !!policyId && policyId > 0,
  })
}

export default useGetMySubInsuredPeople
