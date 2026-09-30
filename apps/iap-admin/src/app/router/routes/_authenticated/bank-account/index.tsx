import { BankAccountsPage } from '@features/bank-accounts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/bank-account/')({
  component: BankAccountsPage,
  loader: () => ({ crumb: 'bankAccounts' }),
})
