import assessmentItemService from '@features/assessment-items/services/assessment-item-editing-service.ts'
import { useQuery } from '@tanstack/react-query'

function useAssessmentItemsData(claimRequestId?: string) {
  return useQuery({
    queryKey: ['assessmentItems', { claimRequestId }],
    queryFn: ({ signal }) =>
      assessmentItemService.getByClaimRequestId(claimRequestId!, { signal }),
    staleTime: 30000,
    gcTime: 30000,
    refetchOnWindowFocus: false,
    enabled: !!claimRequestId,
  })
}

export default useAssessmentItemsData
