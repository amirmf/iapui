import { describe, expect, it } from 'vitest'

import { subUserRouteSearchSchema } from './route-search-schema'

describe('subUserRouteSearchSchema', () => {
  it('parses valid search params', () => {
    const search = {
      displayName: 'test',
      mobileNumber: '09123456789',
      page: '1',
      size: '20',
      status: 'enabled',
      username: 'user1',
    }

    const result = subUserRouteSearchSchema.safeParse(search)
    expect(result.success).toBe(true)
  })

  it('accepts array status', () => {
    const search = {
      status: ['enabled', 'disabled'],
    }

    const result = subUserRouteSearchSchema.safeParse(search)
    expect(result.success).toBe(true)
  })
})
