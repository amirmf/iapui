import type { PartyRole } from '@iap/api-types'
import { redirect } from '@tanstack/react-router'

export type AuthGuardState = {
  isAuthenticated: boolean
  isLoading: boolean
  user: { roles?: PartyRole[] | null } | null
}

type BeforeLoadAuthProps = {
  appDomainUrl: string
  auth: AuthGuardState
  pathname: string
  search: string
}

type BeforeLoadPublicAppProps = Omit<BeforeLoadAuthProps, 'appDomainUrl'> & {
  adminDomainUrl: string
}

function checkPath(pathname: string, pathPrefix: string) {
  if (pathname === '/' || pathPrefix === '/') {
    return pathname === pathPrefix
  }

  return pathname === pathPrefix || pathname.startsWith(`${pathPrefix}/`)
}

export const isAdminRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_ADMIN_USER') ||
  roles.includes('ROLE_SUPER_ADMIN') ||
  roles.includes('ROLE_SUPER_ADMIN_USER')

export const isSuperAdminRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_SUPER_ADMIN_USER')

const isAssessmentRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_ASSESSMENT_USER') ||
  roles.includes('ROLE_MAIN_ASSESSMENT_USER')

const isMonitoringRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_MONITORING_USER')

export const isPublicRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_PUBLIC_USER')

const isDoctorRole = (roles: PartyRole[]) => roles.includes('ROLE_DOCTOR_USER')

const isMainAssessmentRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_MAIN_ASSESSMENT_USER')

const isRegisterAgent = (roles: PartyRole[]) =>
  roles.includes('ROLE_REQUEST_REGISTERY_AGENT') ||
  roles.includes('ROLE_MAIN_REQUEST_REGISTERY_AGENT')

const isHqRole = (roles: PartyRole[]) => roles.includes('ROLE_HQ_USER')

const isBranchRole = (roles: PartyRole[]) => roles.includes('ROLE_BRANCH_USER')

const isCustomerUser = (roles: PartyRole[]) =>
  roles.includes('ROLE_CUSTOMER_USER')

const isTicketAgentRole = (roles: PartyRole[]) =>
  roles.includes('ROLE_TICKET_AGENT')

const monitoringRoute = (pathname: string) =>
  ['/', '/claim-requests', '/user-account', '/otp', '/tickets'].some((route) =>
    checkPath(pathname, route)
  )

const assessmentRoute = (pathname: string) =>
  ['/', '/claim-requests', '/tickets'].some((route) =>
    checkPath(pathname, route)
  )

const branchRoute = (pathname: string) =>
  ['/', '/claim-requests', '/claim-reports'].some((route) =>
    checkPath(pathname, route)
  )

const mainAssessmentRoute = (pathname: string) =>
  ['/', '/claim-requests', '/sub-users', '/tickets'].some((route) =>
    checkPath(pathname, route)
  )

const doctorRoute = (pathname: string) =>
  ['/', '/claim-requests'].some((route) => checkPath(pathname, route))

const hqRoute = (pathname: string) =>
  [
    '/',
    '/claim-requests',
    '/agreements',
    '/user-account',
    '/otp',
    '/bank-account',
    '/claim-reports',
  ].some((route) => checkPath(pathname, route))

const ticketRouteCanRoleAccess = (pathname: string, roles: PartyRole[]) =>
  checkPath(pathname, '/tickets') &&
  (isSuperAdminRole(roles) || isAssessmentRole(roles))

export const canNotAccessPathByRole = (
  roles: PartyRole[],
  pathname: string
) => {
  if (ticketRouteCanRoleAccess(pathname, roles)) {
    return false
  }

  const onlySuperAdminRoute = [
    '/outpatient-doc-acceptances',
    '/support-questions',
    '/pipelines',
    '/medical-center',
    '/ai-assessment-rules',
  ].some((route) => checkPath(pathname, route))

  return onlySuperAdminRoute && !isSuperAdminRole(roles)
}

export const canAccessPathByRole = (roles: PartyRole[], pathname: string) => {
  if (!roles.length) return false
  if (checkPath(pathname, '/agent')) return isRegisterAgent(roles)
  if (checkPath(pathname, '/customer-user')) return isCustomerUser(roles)
  if (isTicketAgentRole(roles) && checkPath(pathname, '/tickets')) return true
  if (isMonitoringRole(roles) && monitoringRoute(pathname)) return true
  if (isAssessmentRole(roles) && assessmentRoute(pathname)) return true
  if (isBranchRole(roles) && branchRoute(pathname)) return true
  if (isDoctorRole(roles) && doctorRoute(pathname)) return true
  if (isMainAssessmentRole(roles) && mainAssessmentRoute(pathname)) return true
  if (isHqRole(roles) && hqRoute(pathname)) return true

  return isAdminRole(roles)
}

export const getAfterLoginDestination = (
  roles: PartyRole[],
  appDomainUrl: string,
  callbackUrl?: string
) => {
  try {
    const decodedCallbackUrl = callbackUrl
      ? decodeURIComponent(callbackUrl)
      : undefined
    const callback = decodedCallbackUrl
      ? new URL(decodedCallbackUrl, 'http://localhost')
      : null
    const isInternalCallback =
      callback?.origin === 'http://localhost' &&
      decodedCallbackUrl?.startsWith('/') &&
      !decodedCallbackUrl.startsWith('//')

    if (
      isInternalCallback &&
      canAccessPathByRole(roles, callback.pathname) &&
      !canNotAccessPathByRole(roles, callback.pathname)
    ) {
      return decodedCallbackUrl ?? '/'
    }
  } catch {
    // An invalid callback is ignored and the role default is used instead.
  }

  if (isPublicRole(roles)) return new URL('/', appDomainUrl).href
  if (isRegisterAgent(roles)) return '/agent/claim-requests/'
  if (isCustomerUser(roles)) return '/customer-user/'

  return '/'
}

export const isExternalDestination = (destination: string) =>
  /^https?:\/\//.test(destination)

export function beforeLoadAuth({
  appDomainUrl,
  auth,
  pathname,
  search,
}: BeforeLoadAuthProps) {
  if (auth.isLoading) return

  if (!auth.isAuthenticated) {
    throw redirect({
      to: '/login/',
      search: { callbackUrl: `${pathname}${search}` },
    })
  }

  const roles = auth.user?.roles ?? []
  if (
    !canAccessPathByRole(roles, pathname) ||
    canNotAccessPathByRole(roles, pathname)
  ) {
    const destination = getAfterLoginDestination(roles, appDomainUrl)

    if (destination.startsWith('http')) {
      throw redirect({ href: destination, to: '/' })
    }

    throw redirect({ to: destination })
  }
}

export function beforeLoadPublicApp({
  adminDomainUrl,
  auth,
  pathname,
  search,
}: BeforeLoadPublicAppProps) {
  if (auth.isLoading) return

  if (!auth.isAuthenticated && !auth.isLoading) {
    throw redirect({
      to: '/login/',
      search: { callbackUrl: `${pathname}${search}` },
    })
  }

  if (!isPublicRole(auth.user?.roles ?? [])) {
    throw redirect({ href: new URL('/', adminDomainUrl).href, to: '/' })
  }
}
