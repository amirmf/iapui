import { AuthLayout } from '@shared/app-shell/auth-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})
