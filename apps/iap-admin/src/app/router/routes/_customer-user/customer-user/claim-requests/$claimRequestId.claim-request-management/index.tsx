import {
  ClaimRequestManagementPanelPending,
  ClaimRequestManagementQueryError,
} from '@features/claim-requests'
import {
  CustomerUserClaimRequestManagementPage,
  customerUserClaimRequestQueryOptions,
} from '@features/customer-user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_customer-user/customer-user/claim-requests/$claimRequestId/claim-request-management/'
)({
  loader: async ({ context, params }) => {
    await context.queryClient.query({
      ...customerUserClaimRequestQueryOptions(params.claimRequestId),
      staleTime: 'static',
    })

    return { crumb: 'claim-request-management' }
  },
  pendingComponent: ClaimRequestManagementPanelPending,
  pendingMs: 200,
  pendingMinMs: 200,
  errorComponent: ({ error }) => (
    <ClaimRequestManagementQueryError error={error} />
  ),
  component: CustomerUserClaimRequestManagementPage,
})
