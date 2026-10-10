import { PreAuthsPage } from '@features/pre-auths'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pre-auths/')({
  component: PreAuthsPage,
  loader: () => ({ crumb: 'preAuths' }),
})
