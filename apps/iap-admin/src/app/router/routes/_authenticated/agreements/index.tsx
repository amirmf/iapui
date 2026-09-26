import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/agreements/')({
  component: () => <PlaceholderPage titleKey='sidebar.agreements' />,
})
