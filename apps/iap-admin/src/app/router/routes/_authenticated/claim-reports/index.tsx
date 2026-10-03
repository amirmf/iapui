import {
  ClaimReportsPage,
  claimReportRouteSearchSchema,
} from '@features/claim-reports'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/claim-reports/')({
  component: ClaimReportsPage,
  loader: () => ({ crumb: 'claimReports' }),
  validateSearch: claimReportRouteSearchSchema,
})
