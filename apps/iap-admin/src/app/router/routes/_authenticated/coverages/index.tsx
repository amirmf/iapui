import { CoveragesPage, coverageRouteSearchSchema } from '@features/coverages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/coverages/')({
  component: CoveragesPage,
  loader: () => ({ crumb: 'coverage' }),
  validateSearch: coverageRouteSearchSchema,
})
