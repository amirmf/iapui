import { MyClaimRequestDetailPage } from '@features/my-claims'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/myclaims/$id/')({
  component: MyClaimRequestDetailPage,
  loader: () => ({ crumb: 'claimDetails' }),
})
