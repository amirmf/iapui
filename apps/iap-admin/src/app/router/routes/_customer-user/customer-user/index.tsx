import { CustomerUserDashboardPage } from '@features/customer-user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_customer-user/customer-user/')({
  component: CustomerUserDashboardPage,
  loader: () => ({
    crumb: 'dashboard',
  }),
})
