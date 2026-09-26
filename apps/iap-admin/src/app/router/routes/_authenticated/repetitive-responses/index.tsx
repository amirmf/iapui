import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/repetitive-responses/')({
  component: () => <PlaceholderPage titleKey='sidebar.repetitiveResponses' />,
})
