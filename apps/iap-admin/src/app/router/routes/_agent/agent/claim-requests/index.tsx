import { AgentClaimRequestsPage } from '@features/agent-claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_agent/agent/claim-requests/')({
  component: AgentClaimRequestsPage,
  loader: () => ({ crumb: 'claim-agent' }),
})
