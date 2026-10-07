import { describe, expect, it } from 'vitest'

import {
  getDistributionReportFilters,
  toStatusDistributionPivotData,
} from './report-distribution-by-status'

describe('status distribution report data', () => {
  const translate = (key: string) => key

  it('keeps result-changing filters and maps a recognized status with all metrics', () => {
    expect(
      getDistributionReportFilters({
        extCustomerId: 'customer-1',
        reportTab: 'reportDistributionByStatus',
        status: ['SUBMITTED'],
      })
    ).toEqual({
      extCustomerId: 'customer-1',
      status: ['SUBMITTED'],
    })

    expect(
      toStatusDistributionPivotData(
        [
          {
            amount: 150,
            count: 2,
            status: 'SUBMITTED',
            totalSumAmount: 100,
          },
        ],
        translate
      )
    ).toEqual([
      {
        amount: 150,
        count: 2,
        distributionLabel: 'dashboard.reports.columns.distribution',
        statusLabel: 'claimRequests.status.submitted',
        totalSumAmount: 100,
      },
    ])
  })

  it('keeps unknown and absent response fields renderable', () => {
    expect(
      toStatusDistributionPivotData(
        [{ status: 'FUTURE_STATUS' }, {}],
        translate
      )
    ).toEqual([
      {
        amount: 0,
        count: 0,
        distributionLabel: 'dashboard.reports.columns.distribution',
        statusLabel: '-',
        totalSumAmount: 0,
      },
      {
        amount: 0,
        count: 0,
        distributionLabel: 'dashboard.reports.columns.distribution',
        statusLabel: '-',
        totalSumAmount: 0,
      },
    ])
    expect(toStatusDistributionPivotData([], translate)).toEqual([])
  })
})
