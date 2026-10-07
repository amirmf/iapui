import type { ClaimRequest, PartyRole } from '@iap/api-types'
import { isAdminRole, isSuperAdminRole, useAuthSession } from '@iap/auth'

export function getClaimRequestManagementPermissions(roles: PartyRole[]) {
  const isSuperAdmin = isSuperAdminRole(roles)
  const isAdmin = isAdminRole(roles)
  const isBranch = roles.includes('ROLE_BRANCH_USER')
  const isHq = roles.includes('ROLE_HQ_USER')
  const isDoctor = roles.includes('ROLE_DOCTOR_USER')
  const isRolesActions =
    isAdmin ||
    isBranch ||
    isHq ||
    roles.includes('ROLE_ASSESSMENT_USER') ||
    roles.includes('ROLE_MAIN_ASSESSMENT_USER')
  return {
    isSuperAdmin,
    isAdmin,
    isBranch,
    isHq,
    isDoctor,
    isRolesActions,
    isDevelopMode: isSuperAdmin,
  }
}
export function useClaimRequestManagementPermissions() {
  return getClaimRequestManagementPermissions(
    useAuthSession().user?.roles ?? []
  )
}
export function useIsSuperAdmin() {
  return useClaimRequestManagementPermissions().isSuperAdmin
}
export function useIsAdmin() {
  return useClaimRequestManagementPermissions().isAdmin
}
export function useIsBranch() {
  return useClaimRequestManagementPermissions().isBranch
}
export function useIsHq() {
  return useClaimRequestManagementPermissions().isHq
}
export function useIsDoctor() {
  return useClaimRequestManagementPermissions().isDoctor
}
export function useIsDevelopMode() {
  return useClaimRequestManagementPermissions().isDevelopMode
}
export function useClaimRequestRolesActions() {
  return useClaimRequestManagementPermissions().isRolesActions
}
export function useClaimRequestStatusAssessment(data?: ClaimRequest) {
  return (
    data?.status === 'IN_ASSESSMENT' ||
    data?.status === 'DEDICATED_TO_USER' ||
    data?.status === 'SENT_FAILED'
  )
}
