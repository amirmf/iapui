import { MyClaimRequestCreatePage } from '@features/my-claims'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated/myclaims/create/')({ component: MyClaimRequestCreatePage, loader: () => ({ crumb: 'createClaim' }) })
