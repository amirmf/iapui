import { coverageRouteSearchSchema } from '@features/coverages/model/coverage-route-search-schema'
import { CoveragesPage } from '@features/coverages/pages/index/coverages-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/coverages/')({
  component: CoveragesPage,
  loader: () => ({ crumb: 'coverage' }),
  validateSearch: coverageRouteSearchSchema,
})
