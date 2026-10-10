import { MyIapPage } from '@features/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: MyIapPage,
  loader: () => ({ crumb: 'myiap' }),
})
