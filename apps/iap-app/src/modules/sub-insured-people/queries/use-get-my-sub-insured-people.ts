import { useQuery } from '@tanstack/react-query'

import { subInsuredPersonService } from '../services/sub-insured-person-service'

export interface UseGetMySubInsuredPeopleProps {
  policyId?: number
}

export function useGetMySubInsuredPeople({
  policyId,
}: UseGetMySubInsuredPeopleProps) {
  return useQuery({
    enabled: !!policyId && policyId > 0,
    queryFn: ({ signal }) =>
      policyId ? subInsuredPersonService.getAll(policyId, signal) : null,
    queryKey: ['subInsuredPeople', policyId],
  })
}

export default useGetMySubInsuredPeople
