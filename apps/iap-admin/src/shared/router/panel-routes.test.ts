import { routeTree } from '@app/router/routeTree.gen'
import { createMemoryHistory, createRouter } from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'

// Unrelated Formio page imports require browser APIs unavailable in jsdom.
vi.mock('@formio/react', () => ({ Form: () => null, FormBuilder: () => null }))

const panelCases = [
  ['/agent/claim-requests', '_agent', '/agent/claim-requests/'],
  ['/agent/claim-requests/create', '_agent', '/agent/claim-requests/create/'],
  [
    '/agent/claim-requests/claim-123',
    '_agent',
    '/agent/claim-requests/$claimRequestId/',
  ],
  [
    '/agent/claim-requests/claim-123/claim-request-management',
    '_agent',
    '/agent/claim-requests/$claimRequestId/claim-request-management/',
  ],
  ['/agent/users/create', '_agent', '/agent/users/create/'],
  ['/customer-user', '_customer-user', '/customer-user/'],
  [
    '/customer-user/claim-requests',
    '_customer-user',
    '/customer-user/claim-requests/',
  ],
  [
    '/customer-user/claim-requests/claim-123/claim-request-management',
    '_customer-user',
    '/customer-user/claim-requests/$claimRequestId/claim-request-management/',
  ],
] as const

function makeRouter() {
  return createRouter({
    routeTree,
    history: createMemoryHistory(),
    context: { auth: undefined!, queryClient: undefined! },
    trailingSlash: 'always',
  })
}

describe('panel route boundaries', () => {
  it.each(panelCases)(
    'matches %s under its authenticated panel',
    (url, group, fullPath) => {
      const router = makeRouter()
      for (const pathname of [url, `${url}/`]) {
        const matches = router.matchRoutes(pathname)
        expect(matches.at(-1)?.fullPath).toBe(fullPath)
        expect(matches.map((match) => match.routeId)).toContain(
          '/_authenticated'
        )
        expect(matches.map((match) => match.routeId)).toContain(
          `/_authenticated/${group}`
        )
        expect(matches.map((match) => match.routeId)).not.toContain(
          `/_authenticated/${group === '_agent' ? '_customer-user' : '_agent'}`
        )
        if (url.includes('claim-123')) {
          expect(matches.at(-1)?.params).toMatchObject({
            claimRequestId: 'claim-123',
          })
        }
      }
    }
  )

  it('keeps the agent root layout-only and the operations branch separate', () => {
    const router = makeRouter()
    expect(router.matchRoutes('/agent').at(-1)?.routeId).toBe(
      '/_authenticated/_agent/agent'
    )
    const matches = router.matchRoutes('/claim-requests/')
    expect(matches.at(-1)?.routeId).toBe('/_authenticated/claim-requests/')
    expect(matches.map((match) => match.routeId)).not.toContain(
      '/_authenticated/_agent'
    )
    expect(matches.map((match) => match.routeId)).not.toContain(
      '/_authenticated/_customer-user'
    )
  })
})
