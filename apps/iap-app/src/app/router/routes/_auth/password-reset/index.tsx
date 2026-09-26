import { PasswordReset } from '@features/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/password-reset/')({
  component: PasswordReset,
})
