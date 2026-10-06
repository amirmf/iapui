import {
  OutpatientDocAcceptancesPage,
  outpatientDocAcceptanceRouteSearchSchema,
} from '@features/outpatient-doc-acceptances'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/outpatient-doc-acceptances/'
)({
  component: OutpatientDocAcceptancesPage,
  loader: () => ({ crumb: 'outpatientDocAcceptances' }),
  validateSearch: outpatientDocAcceptanceRouteSearchSchema,
})
