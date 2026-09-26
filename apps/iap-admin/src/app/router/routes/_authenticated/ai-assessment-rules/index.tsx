import { PlaceholderPage } from '@features/placeholder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/ai-assessment-rules/')({
  component: () => <PlaceholderPage titleKey='sidebar.aiAssessmentRules' />,
})
