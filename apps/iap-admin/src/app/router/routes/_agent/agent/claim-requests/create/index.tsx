import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_agent/agent/claim-requests/create/')({
  component: () => <PlaceholderPage titleKey='sidebar.createClaimRequests' />,
  loader: () => ({ crumb: 'createClaim' }),
})
