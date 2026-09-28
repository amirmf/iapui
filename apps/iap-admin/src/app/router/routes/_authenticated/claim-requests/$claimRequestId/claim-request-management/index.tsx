import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/claim-requests/$claimRequestId/claim-request-management/'
)({
  component: () => (
    <PlaceholderPage titleKey='claimRequests.management.title' />
  ),
})
