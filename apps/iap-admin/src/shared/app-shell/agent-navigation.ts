import type { LucideIcon } from 'lucide-react'
import { FilePlus, FileText, UserPlus } from 'lucide-react'

export type AgentNavigationItem = {
  icon: LucideIcon
  titleKey: string
  to: string
}

export const agentNavigation: readonly AgentNavigationItem[] = [
  {
    icon: FileText,
    titleKey: 'sidebar.claimRequestsAgent',
    to: '/agent/claim-requests/',
  },
  {
    icon: FilePlus,
    titleKey: 'sidebar.createClaimRequests',
    to: '/agent/claim-requests/create/',
  },
  {
    icon: UserPlus,
    titleKey: 'sidebar.createInsuredUser',
    to: '/agent/users/create/',
  },
]
