import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_customer-user/customer-user/claim-requests/$claimRequestId/claim-request-management/'
)({
  component: () => (
    <PlaceholderPage titleKey='claimRequests.management.title' />
  ),
  loader: () => ({ crumb: 'claim-request-management' }),
})
