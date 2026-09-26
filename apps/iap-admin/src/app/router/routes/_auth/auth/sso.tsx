import { Sso } from '@features/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/auth/sso')({
  component: Sso,
})
