import {
  AssessmentPromptsPage,
  assessmentPromptRouteSearchSchema,
} from '@features/assessment-prompts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/assessment-prompts/')({
  component: AssessmentPromptsPage,
  loader: () => ({ crumb: 'assessment' }),
  validateSearch: assessmentPromptRouteSearchSchema,
})
