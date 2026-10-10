import { routeTree } from '@app/router/routeTree.gen'
import { createMemoryHistory, createRouter } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'

const customerRouteCases = [
  ['/', '/_authenticated', '/'],
  ['/myclaims', '/_authenticated', '/myclaims/'],
  ['/myclaims/create', '/_authenticated', '/myclaims/create/'],
  ['/myclaims/claim-123', '/_authenticated', '/myclaims/$id/'],
  ['/special-diseases', '/_authenticated', '/special-diseases/'],
  ['/special-diseases/create', '/_authenticated', '/special-diseases/create/'],
  [
    '/special-diseases/disease-456',
    '/_authenticated',
    '/special-diseases/$id/',
  ],
  ['/pre-auths', '/_authenticated', '/pre-auths/'],
] as const

function makeRouter() {
  return createRouter({
    context: { auth: undefined!, queryClient: undefined! },
    history: createMemoryHistory(),
    routeTree,
    trailingSlash: 'always',
  })
}

describe('customer app route boundaries', () => {
  it.each(customerRouteCases)(
    'matches %s under _authenticated layout at %s',
    (url, group, fullPath) => {
      const router = makeRouter()
      for (const pathname of [url, `${url}/`]) {
        const matches = router.matchRoutes(pathname)
        expect(matches.at(-1)?.fullPath).toBe(fullPath)
        expect(matches.map((match) => match.routeId)).toContain(group)
      }
    }
  )

  it('matches dynamic parameters for claim and special-disease details', () => {
    const router = makeRouter()
    const claimMatches = router.matchRoutes('/myclaims/claim-123/')
    expect(claimMatches.at(-1)?.params).toMatchObject({ id: 'claim-123' })

    const diseaseMatches = router.matchRoutes('/special-diseases/disease-456/')
    expect(diseaseMatches.at(-1)?.params).toMatchObject({ id: 'disease-456' })
  })

  it('does not register /myiap prefix in iap-app', () => {
    const router = makeRouter()
    expect(
      Object.values(router.routesById).some((route) =>
        route.fullPath.startsWith('/myiap')
      )
    ).toBe(false)
  })
})
