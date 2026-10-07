import type { ApiFilterParams } from '@iap/shared-lib'

export const MY_IAP_SENT_TO_BANK_FILTER_VALUE = 'SENT_TO_BANK' as const

export function applyClaimRequestQuickStatusFilter(
  filters: ApiFilterParams,
  quickStatus: string
) {
  delete filters.quickStatus
  delete filters.extPaymentDate
  delete filters.extPaymentDate__neq

  if (quickStatus === MY_IAP_SENT_TO_BANK_FILTER_VALUE) {
    filters.status = 'PAID'
    filters.extPaymentDate = 'null'
  } else if (quickStatus === 'PAID') {
    filters.status = 'PAID'
    filters.extPaymentDate__neq = 'null'
  } else if (quickStatus !== 'ALL') {
    filters.status = quickStatus
  }
}

export default applyClaimRequestQuickStatusFilter
