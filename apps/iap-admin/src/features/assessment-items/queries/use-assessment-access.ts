import type { ClaimRequest } from '@iap/api-types'
import {
  isAdminRole,
  isDoctorRole,
  isSuperAdminRole,
  useAuthSession,
} from '@iap/auth'

export function useIsSuperAdmin() {
  const { user } = useAuthSession()
  return isSuperAdminRole(user?.roles ?? [])
}
export function useClaimRequestIgnoreRoles() {
  const { user } = useAuthSession()
  const roles = user?.roles ?? []
  return isDoctorRole(roles) || roles.includes('ROLE_CUSTOMER_USER')
}
export function useClaimRequestStatusAssessment(claimRequest?: ClaimRequest) {
  return (
    claimRequest?.status === 'IN_ASSESSMENT' ||
    claimRequest?.status === 'DEDICATED_TO_USER' ||
    claimRequest?.status === 'SENT_FAILED'
  )
}
export function useClaimRequestRolesActions() {
  const { user } = useAuthSession()
  const roles = user?.roles ?? []
  return (
    isAdminRole(roles) ||
    roles.includes('ROLE_ASSESSMENT_USER') ||
    roles.includes('ROLE_MAIN_ASSESSMENT_USER') ||
    roles.includes('ROLE_HQ_USER') ||
    roles.includes('ROLE_BRANCH_USER')
  )
}
