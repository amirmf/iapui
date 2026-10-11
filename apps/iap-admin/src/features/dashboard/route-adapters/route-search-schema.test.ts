import { describe, expect, it } from 'vitest'

import {
  dashboardReportTabSchema,
  dashboardRouteSearchSchema,
} from './route-search-schema'

describe('dashboardRouteSearchSchema', () => {
  it('parses valid tab values', () => {
    const parsed = dashboardRouteSearchSchema.parse({
      reportTab: 'reportCountByAssigneeSummary',
    })
    expect(parsed.reportTab).toBe('reportCountByAssigneeSummary')
  })

  it('allows empty search query', () => {
    const parsed = dashboardRouteSearchSchema.parse({})
    expect(parsed.reportTab).toBeUndefined()
  })

  it('rejects invalid tab values', () => {
    expect(() => dashboardReportTabSchema.parse('invalidTab')).toThrow()
  })

  it('accepts additional filter query parameters', () => {
    const parsed = dashboardRouteSearchSchema.parse({
      reportTab: 'reportDistributionByStatus',
      status: ['APPROVED', 'REJECTED'],
      extContractId: '12345',
    })
    expect(parsed.reportTab).toBe('reportDistributionByStatus')
    expect(parsed.status).toEqual(['APPROVED', 'REJECTED'])
    expect(parsed.extContractId).toBe('12345')
  })
})
