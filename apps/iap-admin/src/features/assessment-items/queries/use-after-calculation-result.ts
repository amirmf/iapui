import assessmentItemService from '@features/assessment-items/services/assessment-item-editing-service.ts'
import { useQuery } from '@tanstack/react-query'

function useAfterCalculationResult(claimRequestId?: string, enabled = true) {
  return useQuery({
    queryKey: ['assessmentItemAfterCalculationResult', claimRequestId],
    queryFn: () =>
      assessmentItemService.getAfterCalculationResult({
        claimRequestId: claimRequestId || '',
      }),
    enabled: enabled && !!claimRequestId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })
}

export default useAfterCalculationResult
