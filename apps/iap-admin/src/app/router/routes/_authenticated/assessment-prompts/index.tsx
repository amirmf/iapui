import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/assessment-prompts/')({
  component: () => <PlaceholderPage titleKey='sidebar.assessmentPrompts' />,
})
