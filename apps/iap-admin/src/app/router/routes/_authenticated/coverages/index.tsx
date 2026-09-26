import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/coverages/')({
  component: () => <PlaceholderPage titleKey='sidebar.coverages-maxa' />,
})
