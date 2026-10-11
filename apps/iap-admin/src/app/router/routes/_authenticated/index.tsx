import { DashboardPage, dashboardRouteSearchSchema } from '@features/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
  loader: () => ({
    crumb: 'dashboard',
  }),
  validateSearch: dashboardRouteSearchSchema,
})
