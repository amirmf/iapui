import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/support-questions/')({
  component: () => <PlaceholderPage titleKey='sidebar.supportQuestions' />,
})
