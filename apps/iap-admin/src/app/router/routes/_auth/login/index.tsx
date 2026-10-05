import { Login, authRouteSearchSchema } from '@features/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
  component: Login,
  validateSearch: authRouteSearchSchema,
})
