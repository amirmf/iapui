import { useParams } from '@tanstack/react-router'

export function useClaimRequestManagementParams(_options?: unknown) {
  void _options
  return useParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })
}
