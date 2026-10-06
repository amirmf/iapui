import { describe, expect, it } from 'vitest'

import { outpatientDocAcceptanceRouteSearchSchema } from './route-search-schema'

describe('outpatientDocAcceptanceRouteSearchSchema', () => {
  it('accepts all mounted reference filters and controls', () => {
    expect(
      outpatientDocAcceptanceRouteSearchSchema.parse({
        deliveryDateFrom: '2026-10-01',
        deliveryDateTo: '2026-10-06',
        exId: 'EX-1',
        letterNo: 'CL-1',
        inqueryStatusTitle: 'DONE',
        wsStatus: ['DONE'],
        opUnitId: '1',
        extLocationId: '2',
        updatedAtFrom: '2026-10-01',
        direction: 'desc',
        page: '2',
        policyId: 'POL-1',
        size: '40',
        sort: 'exId',
        status: ['SUCCESS'],
      })
    ).toMatchObject({ sort: 'exId', direction: 'desc', status: ['SUCCESS'] })
  })

  it('rejects invalid URL values and unknown filters', () => {
    expect(
      outpatientDocAcceptanceRouteSearchSchema.safeParse({ page: 2 }).success
    ).toBe(false)
    expect(
      outpatientDocAcceptanceRouteSearchSchema.safeParse({ direction: 'up' })
        .success
    ).toBe(false)
    expect(
      outpatientDocAcceptanceRouteSearchSchema.safeParse({
        unexpected: 'value',
      }).success
    ).toBe(false)
  })
})
