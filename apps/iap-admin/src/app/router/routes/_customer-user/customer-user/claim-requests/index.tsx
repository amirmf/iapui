import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_customer-user/customer-user/claim-requests/'
)({
  component: () => <PlaceholderPage titleKey='sidebar.claimRequests' />,
  loader: () => ({ crumb: 'claim' }),
})
