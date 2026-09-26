import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/branches/')({
  component: () => <PlaceholderPage titleKey='sidebar.branches' />,
})
