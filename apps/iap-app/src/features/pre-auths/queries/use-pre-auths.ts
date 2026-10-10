import type { GetPreAuthsRequest, PagePreAuth } from '@iap/api-types'
import { useQuery } from '@tanstack/react-query'

import { preAuthService } from '../services/pre-auth-service'

export const preAuthQueryKeys = {
  all: ['my-iap-pre-auths'] as const,
  list: (request: GetPreAuthsRequest) =>
    [...preAuthQueryKeys.all, 'list', request] as const,
}

export function usePreAuths(request: GetPreAuthsRequest | null) {
  return useQuery<PagePreAuth>({
    enabled: request !== null,
    gcTime: 30_000,
    placeholderData: (previousData) => previousData,
    queryFn: ({ signal }) => {
      if (!request) {
        throw new Error('Pre-authorization request parameters are required')
      }

      return preAuthService.getPage(request, signal)
    },
    queryKey: request
      ? preAuthQueryKeys.list(request)
      : [...preAuthQueryKeys.all, 'list', 'disabled'],
    staleTime: 30_000,
  })
}
