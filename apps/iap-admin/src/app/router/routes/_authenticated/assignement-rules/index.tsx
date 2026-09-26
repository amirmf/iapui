import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/assignement-rules/')({
  component: () => <PlaceholderPage titleKey='sidebar.assignementRules' />,
})
