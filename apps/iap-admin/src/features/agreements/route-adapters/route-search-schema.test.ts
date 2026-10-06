import { describe, expect, it } from 'vitest'

import { agreementRouteSearchSchema } from './route-search-schema'

describe('agreementRouteSearchSchema', () => {
  it('accepts URL-compatible agreement table filters and controls', () => {
    expect(
      agreementRouteSearchSchema.parse({
        direction: 'desc',
        extContractId: 'CON-100',
        page: '2',
        size: '20',
        sort: 'fromDate',
        status: 'ACTIVE',
        thruDate__from: '2026-01-01',
        thruDate__to: '2026-01-31',
        title: 'Group agreement',
      })
    ).toEqual({
      direction: 'desc',
      extContractId: 'CON-100',
      page: '2',
      size: '20',
      sort: 'fromDate',
      status: 'ACTIVE',
      thruDate__from: '2026-01-01',
      thruDate__to: '2026-01-31',
      title: 'Group agreement',
    })
  })

  it('rejects controls that cannot be represented in the URL', () => {
    expect(agreementRouteSearchSchema.safeParse({ page: 2 }).success).toBe(
      false
    )
    expect(
      agreementRouteSearchSchema.safeParse({ direction: 'sideways' }).success
    ).toBe(false)
  })

  it('rejects filters outside the agreement table contract', () => {
    expect(
      agreementRouteSearchSchema.safeParse({ unknownFilter: 'value' }).success
    ).toBe(false)
  })
})
