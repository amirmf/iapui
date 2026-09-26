import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pipelines/')({
  component: () => <PlaceholderPage titleKey='sidebar.pipelines' />,
})
