import { CustomerUserClaimRequestsPage } from '@features/customer-user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_customer-user/customer-user/claim-requests/'
)({
  component: CustomerUserClaimRequestsPage,
  loader: () => ({ crumb: 'claim' }),
})
