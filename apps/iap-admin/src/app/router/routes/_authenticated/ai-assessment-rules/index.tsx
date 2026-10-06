import {
  AiAssessmentRulesPage,
  aiAssessmentRuleRouteSearchSchema,
} from '@features/ai-assessment-rules'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/ai-assessment-rules/')({
  component: AiAssessmentRulesPage,
  loader: () => ({ crumb: 'ai-assessment-rules' }),
  validateSearch: aiAssessmentRuleRouteSearchSchema,
})
