import { SubUsersPage, subUserRouteSearchSchema } from '@features/sub-users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sub-users/')({
  component: SubUsersPage,
  loader: () => ({ crumb: 'subUsers' }),
  validateSearch: subUserRouteSearchSchema,
})
