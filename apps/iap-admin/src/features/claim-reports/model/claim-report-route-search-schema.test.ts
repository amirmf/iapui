import { describe, expect, it } from 'vitest'

import { claimReportRouteSearchSchema } from './claim-report-route-search-schema'

describe('claimReportRouteSearchSchema', () => {
  it('accepts the claim-report table filters and controls', () => {
    expect(
      claimReportRouteSearchSchema.parse({
        deliveryDateFrom: '2026-10-01',
        direction: 'desc',
        page: '2',
        size: '40',
        sort: 'exId',
        status: ['SUCCESS'],
      })
    ).toMatchObject({
      deliveryDateFrom: '2026-10-01',
      direction: 'desc',
      page: '2',
      size: '40',
      sort: 'exId',
      status: ['SUCCESS'],
    })
  })

  it('rejects non-URL values and unknown filters', () => {
    expect(claimReportRouteSearchSchema.safeParse({ page: 2 }).success).toBe(
      false
    )
    expect(
      claimReportRouteSearchSchema.safeParse({ unexpected: 'value' }).success
    ).toBe(false)
  })
})
