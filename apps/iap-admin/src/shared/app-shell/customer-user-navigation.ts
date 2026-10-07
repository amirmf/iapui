import type { LucideIcon } from 'lucide-react'
import { FileText, LayoutDashboard } from 'lucide-react'

export type CustomerUserNavigationItem = {
  icon: LucideIcon
  titleKey: string
  to: string
}

export const customerUserNavigation: readonly CustomerUserNavigationItem[] = [
  {
    icon: LayoutDashboard,
    titleKey: 'sidebar.dashboard',
    to: '/customer-user/',
  },
  {
    icon: FileText,
    titleKey: 'customerUser.claimRequests.nav',
    to: '/customer-user/claim-requests/',
  },
]
