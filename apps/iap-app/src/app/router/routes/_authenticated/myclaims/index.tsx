import { MyClaimRequestsPage } from '@features/my-claims'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/myclaims/')({
  component: MyClaimRequestsPage,
  loader: () => ({ crumb: 'myClaims' }),
})
