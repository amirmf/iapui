import { describe, expect, it } from 'vitest'

import { getSupportFlowContext } from './support-flow-context'

describe('getSupportFlowContext', () => {
  it.each([
    ['/claim-requests/', { isMyIap: false, pageKey: 'claim-requests' }],
    [
      '/myiap/myclaims/create',
      { isMyIap: true, pageKey: 'myiap__myclaims__create' },
    ],
    [
      '/myiap/myclaims/claim-abc',
      { isMyIap: true, pageKey: 'myiap__myclaims__UUID' },
    ],
    [
      '/claim-requests/opaque-id/assessment-items',
      {
        isMyIap: false,
        pageKey: 'claim-requests__opaque-id__assessment-items',
      },
    ],
    [
      '/claim-requests/550e8400-e29b-41d4-a716-446655440000',
      { isMyIap: false, pageKey: 'claim-requests__UUID' },
    ],
    ['/items/123', { isMyIap: false, pageKey: 'items__UUID' }],
    ['/items/item-123', { isMyIap: false, pageKey: 'items__item-123' }],
    ['/', { isMyIap: false, pageKey: 'panel-root' }],
  ])('maps %s to its panel and page key', (pathname, expected) => {
    expect(getSupportFlowContext(pathname)).toEqual(expected)
  })

  it.each([
    [
      '/claim-requests/opaque-id/claim-request-management',
      'claim-requests__UUID__claim-request-management',
    ],
    ['/doc-types/opaque-id/edit', 'doc-types__UUID__edit'],
    ['/doc-types/opaque-id/form-builder', 'doc-types__UUID__form-builder'],
    [
      '/doc-types/opaque-id/submission-example',
      'doc-types__UUID__submission-example',
    ],
    ['/agent/claim-requests/opaque-id', 'agent__claim-requests__UUID'],
    ['/agent/claim-requests/create', 'agent__claim-requests__create'],
    [
      '/agent/claim-requests/opaque-id/claim-request-management',
      'agent__claim-requests__UUID__claim-request-management',
    ],
    [
      '/customer-user/claim-requests/opaque-id/claim-request-management',
      'customer-user__claim-requests__UUID__claim-request-management',
    ],
    [
      '/formio/claim-requests/a/documents/b',
      'formio__claim-requests__UUID__documents__UUID',
    ],
    ['/formio/doc-types/opaque-id/builder', 'formio__doc-types__UUID__builder'],
    [
      '/formio/doc-types/opaque-id/submission-example',
      'formio__doc-types__UUID__submission-example',
    ],
  ])(
    'normalizes opaque values for every declared dynamic route',
    (pathname, pageKey) => {
      expect(getSupportFlowContext(pathname).pageKey).toBe(pageKey)
    }
  )

  it.each([['/myiap/myclaims/create', 'myiap__myclaims__create']])(
    'preserves the static MyIAP route sibling',
    (pathname, pageKey) => {
      expect(getSupportFlowContext(pathname).pageKey).toBe(pageKey)
    }
  )

  it.each([
    ['/login', 'login'],
    ['/register', 'register'],
    ['/password-reset', 'password-reset'],
  ])('marks %s as a public support flow', (pathname, pageKey) => {
    expect(getSupportFlowContext(pathname)).toMatchObject({
      isPublic: true,
      pageKey,
    })
  })
})
