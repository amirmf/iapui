import { BranchesPage } from '@features/branches'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/branches/')({
  component: BranchesPage,
  loader: () => ({ crumb: 'branches' }),
})
