import { AgentClaimRequestsCreatePage } from '@features/agent-claim-requests'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_agent/agent/claim-requests/create/')({
  component: AgentClaimRequestsCreatePage,
  loader: () => ({ crumb: 'createClaim' }),
})
