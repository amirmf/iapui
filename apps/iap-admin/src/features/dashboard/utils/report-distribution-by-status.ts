import { CLAIM_REQUEST_STATUS_TRANSLATION_KEYS } from '@features/claim-requests'
import type {
  ClaimRequestStatus,
  DashboardFilters,
  StatusDistributionReport,
} from '@iap/api-types'

export interface StatusDistributionPivotData extends Record<string, unknown> {
  amount: number
  count: number
  distributionLabel: string
  statusLabel: string
  totalSumAmount: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translate = (key: any) => string

const isClaimRequestStatus = (status: string): status is ClaimRequestStatus =>
  status in CLAIM_REQUEST_STATUS_TRANSLATION_KEYS

export function getDistributionReportFilters(filters: DashboardFilters) {
  const reportFilters = { ...filters }
  delete reportFilters['reportTab']
  return reportFilters
}

export function toStatusDistributionPivotData(
  reports: StatusDistributionReport[],
  t: Translate
): StatusDistributionPivotData[] {
  return reports.map((item) => {
    const statusTranslationKey =
      item.status && isClaimRequestStatus(item.status)
        ? CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[item.status]
        : undefined

    return {
      amount: item.amount ?? 0,
      count: item.count ?? 0,
      distributionLabel: t('dashboard.reports.columns.distribution'),
      statusLabel: statusTranslationKey ? t(statusTranslationKey) : '-',
      totalSumAmount: item.totalSumAmount ?? 0,
    }
  })
}
