import type { GetPreAuthsRequest } from '@features/assessment-items/model/assessment-item-form-contract'
import assessmentItemService from '@features/assessment-items/services/assessment-item-editing-service'
import { useQuery } from '@tanstack/react-query'

export const preAuthInquiryQueryKeys = {
  all: ['assessment-items', 'pre-auth-inquiries'] as const,
  list: (request: GetPreAuthsRequest) =>
    [...preAuthInquiryQueryKeys.all, 'list', request] as const,
}

export function usePreAuthInquiries(request: GetPreAuthsRequest | null) {
  return useQuery({
    queryKey: request
      ? preAuthInquiryQueryKeys.list(request)
      : [...preAuthInquiryQueryKeys.all, 'list', 'disabled'],
    queryFn: ({ signal }) => {
      if (!request) {
        throw new Error('Pre-authorization request parameters are required')
      }

      return assessmentItemService.getPreAuths(request, signal)
    },
    enabled: request !== null,
    placeholderData: (previousData) => previousData,
  })
}
