import { AgentClaimRequestsDetailPage } from '@features/agent-claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_agent/agent/claim-requests/$claimRequestId/'
)({
  component: AgentClaimRequestsDetailPage,
  loader: () => ({ crumb: 'claimDetails' }),
})
