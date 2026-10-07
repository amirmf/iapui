import { z } from 'zod'

export type SupportFlowContext = {
  isMyIap: boolean
  pageKey: string
  isPublic?: boolean
}

const uuidSegmentSchema = z.uuid()

type RoutePatternSegment = string | undefined

// Keep static paths before parameterized siblings so an exact static route is
// never interpreted as a parameter route.
const routePatterns: readonly (readonly RoutePatternSegment[])[] = [
  ['myiap', 'myclaims', 'create'],
  ['myiap', 'myclaims', undefined],
  ['claim-requests', undefined, 'claim-request-management'],
  ['doc-types', undefined, 'edit'],
  ['doc-types', undefined, 'form-builder'],
  ['doc-types', undefined, 'submission-example'],
  ['agent', 'claim-requests', 'create'],
  ['agent', 'claim-requests', undefined],
  ['agent', 'claim-requests', undefined, 'claim-request-management'],
  ['customer-user', 'claim-requests', undefined, 'claim-request-management'],
  ['formio', 'claim-requests', undefined, 'documents', undefined],
  ['formio', 'doc-types', undefined, 'builder'],
  ['formio', 'doc-types', undefined, 'submission-example'],
]

function getRoutePatternPageKey(segments: string[]): string | undefined {
  const matchingPattern = routePatterns.find(
    (pattern) =>
      pattern.length === segments.length &&
      pattern.every(
        (patternSegment, index) =>
          patternSegment === undefined || patternSegment === segments[index]
      )
  )

  return matchingPattern?.map((segment) => segment ?? 'UUID').join('__')
}

export function getSupportFlowContext(pathname: string): SupportFlowContext {
  const normalizedPathname = pathname.replace(/^\/+|\/+$/g, '')
  const segments = normalizedPathname ? normalizedPathname.split('/') : []
  const pageKey =
    getRoutePatternPageKey(segments) ??
    segments
      .map((segment) =>
        /^\d+$/.test(segment) || uuidSegmentSchema.safeParse(segment).success
          ? 'UUID'
          : segment
      )
      .join('__')

  const isPublic =
    pathname === '/login' ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/password-reset')

  return {
    isMyIap: pathname === '/myiap' || pathname.startsWith('/myiap/'),
    pageKey: pageKey || 'panel-root',
    ...(isPublic ? { isPublic: true } : {}),
  }
}
