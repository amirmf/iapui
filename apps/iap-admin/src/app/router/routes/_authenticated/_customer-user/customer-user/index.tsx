import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/_customer-user/customer-user/'
)({
  component: () => <PlaceholderPage titleKey='sidebar.dashboard' />,
  loader: () => ({ crumb: 'dashboard' }),
})
