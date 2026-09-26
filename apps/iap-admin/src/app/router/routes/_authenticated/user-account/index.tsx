import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/user-account/')({
  component: () => <PlaceholderPage titleKey='sidebar.parties' />,
})
