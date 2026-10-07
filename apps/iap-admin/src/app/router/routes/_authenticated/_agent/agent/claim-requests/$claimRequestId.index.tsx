import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_agent/agent/claim-requests/$claimRequestId/'
)({
  component: () => (
    <PlaceholderPage titleKey='panelPlaceholders.claimDetails' />
  ),
  loader: () => ({ crumb: 'claimDetails' }),
})
