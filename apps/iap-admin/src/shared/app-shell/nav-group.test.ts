import { describe, expect, it } from 'vitest'

import { isNavItemActive } from './nav-utils'

describe('Navigation active state', () => {
  it('marks dashboard and claim navigation independently', () => {
    expect(
      isNavItemActive('/customer-user', {
        title: 'Dashboard',
        url: '/customer-user',
      })
    ).toBe(true)
    expect(
      isNavItemActive('/customer-user/claim-requests', {
        title: 'Claim requests',
        url: '/customer-user/claim-requests',
      })
    ).toBe(true)
    expect(
      isNavItemActive('/customer-user/claim-requests', {
        title: 'Dashboard',
        url: '/customer-user',
      })
    ).toBe(false)
    expect(
      isNavItemActive(
        '/customer-user/claim-requests/claim-1/claim-request-management',
        {
          matchDescendants: true,
          title: 'Claim requests',
          url: '/customer-user/claim-requests',
        }
      )
    ).toBe(true)
  })

  it('tolerates trailing slashes canonicalization', () => {
    expect(
      isNavItemActive('/claim-requests/', {
        title: 'Claim Requests',
        url: '/claim-requests',
      })
    ).toBe(true)
    expect(
      isNavItemActive('/claim-requests', {
        title: 'Claim Requests',
        url: '/claim-requests/',
      })
    ).toBe(true)
  })
})
