import { queryOptions } from '@tanstack/react-query'

import { getSubInsuredPeople } from '../services/sub-insured-person-service'

export function subInsuredPeopleQuery(policyId?: number) {
  return queryOptions({
    enabled: Boolean(policyId && policyId > 0),
    gcTime: 30_000,
    queryFn: ({ signal }) => {
      if (!policyId) {
        throw new Error('policyId is required to fetch sub-insured people')
      }
      return getSubInsuredPeople(policyId, signal)
    },
    queryKey: ['sub-insured-people', policyId],
    staleTime: 30_000,
  })
}
