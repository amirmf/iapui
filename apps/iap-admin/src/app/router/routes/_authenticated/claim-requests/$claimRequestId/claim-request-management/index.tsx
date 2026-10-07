import {
  ClaimRequestManagementPage,
  ClaimRequestManagementPending,
  ClaimRequestManagementQueryError,
  claimRequestManagementQueryOptions,
} from '@features/claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/claim-requests/$claimRequestId/claim-request-management/'
)({
  loader: ({ context, params }) =>
    context.queryClient.query({
      ...claimRequestManagementQueryOptions(params.claimRequestId),
      staleTime: 'static',
    }),
  pendingComponent: ClaimRequestManagementPending,
  pendingMs: 200,
  pendingMinMs: 200,
  errorComponent: ({ error }) => (
    <ClaimRequestManagementQueryError error={error} />
  ),
  component: ClaimRequestManagementPage,
})
