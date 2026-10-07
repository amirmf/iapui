import {
  AgentClaimRequestManagement,
  agentClaimRequestManagementQueryOptions,
} from '@features/agent-claim-requests'
import {
  ClaimRequestManagementPanelPending,
  ClaimRequestManagementQueryError,
} from '@features/claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_agent/agent/claim-requests/$claimRequestId/claim-request-management/'
)({
  loader: async ({ context, params }) => {
    await context.queryClient.query({
      ...agentClaimRequestManagementQueryOptions(params.claimRequestId),
      staleTime: 'static',
    })

    return { crumb: 'claimDetails' }
  },
  pendingComponent: ClaimRequestManagementPanelPending,
  pendingMs: 200,
  pendingMinMs: 200,
  errorComponent: ({ error }) => (
    <ClaimRequestManagementQueryError error={error} />
  ),
  component: AgentClaimRequestManagement,
})
