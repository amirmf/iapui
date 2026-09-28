import { userAccountRouteSearchSchema } from '@features/user-account/model/user-account-route-search-schema'
import { describe, expect, it } from 'vitest'

describe('userAccountRouteSearchSchema', () => {
  it('accepts URL-compatible table search values', () => {
    expect(
      userAccountRouteSearchSchema.parse({
        page: '2',
        'roles.name': ['ROLE_ADMIN_USER'],
        sort: undefined,
      })
    ).toEqual({
      page: '2',
      'roles.name': ['ROLE_ADMIN_USER'],
      sort: undefined,
    })
  })

  it('rejects values that cannot be represented by the table URL adapter', () => {
    expect(userAccountRouteSearchSchema.safeParse({ page: 2 }).success).toBe(
      false
    )
  })

  it('rejects unknown feature filters', () => {
    expect(
      userAccountRouteSearchSchema.safeParse({ unknownFilter: 'value' }).success
    ).toBe(false)
  })
})
