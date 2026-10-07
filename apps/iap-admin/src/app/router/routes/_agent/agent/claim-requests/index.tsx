import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_agent/agent/claim-requests/')({
  component: () => <PlaceholderPage titleKey='sidebar.claimRequestsAgent' />,
  loader: () => ({ crumb: 'claim-agent' }),
})
