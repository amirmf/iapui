import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sub-users/')({
  component: () => <PlaceholderPage titleKey='sidebar.subUsers' />,
})
