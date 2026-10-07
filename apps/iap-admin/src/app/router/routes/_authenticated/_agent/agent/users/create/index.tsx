import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_agent/agent/users/create/'
)({
  component: () => (
    <PlaceholderPage titleKey='panelPlaceholders.agentUserSignup' />
  ),
  loader: () => ({ crumb: 'agentUserSignup' }),
})
