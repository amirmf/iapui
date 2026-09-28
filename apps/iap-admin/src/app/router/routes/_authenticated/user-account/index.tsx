import { UserAccountsPage } from '@features/user-account'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/user-account/')({
  component: UserAccountsPage,
  loader: () => ({ crumb: 'party' }),
})
