import {
  AssignementRulesPage,
  assignementRuleRouteSearchSchema,
} from '@features/assignement-rules'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/assignement-rules/')({
  component: AssignementRulesPage,
  loader: () => ({ crumb: 'assignementRules' }),
  validateSearch: assignementRuleRouteSearchSchema,
})
