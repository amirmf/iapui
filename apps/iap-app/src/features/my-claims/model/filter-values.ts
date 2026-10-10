import {
  MY_IAP_SENT_TO_BANK_FILTER_VALUE,
  type MyIapClaimRequestStatusFilterValue,
} from '@features/my-claims/constants/claim-status-constant'
import type { ClaimRequestStatus } from '@iap/api-types'

export interface MyClaimRequestsFilterValues {
  status?: ClaimRequestStatus[]
  extPaymentDate?: 'null'
  extPaymentDate__neq?: 'null'
  extPolicyId?: number
  extNationalCode?: string
  submitDate__from?: string
  submitDate__to?: string
  createdAt__from?: string
  createdAt__to?: string
}

export type MyClaimRequestsFilterFormValues = Omit<
  MyClaimRequestsFilterValues,
  'status' | 'extPaymentDate' | 'extPaymentDate__neq'
> & {
  status?: MyIapClaimRequestStatusFilterValue[]
}

export const toFilterFormValues = (
  filters: MyClaimRequestsFilterValues
): MyClaimRequestsFilterFormValues => {
  const formValues = { ...filters }
  delete formValues.extPaymentDate
  delete formValues.extPaymentDate__neq
  const isSentToBank =
    filters.status?.length === 1 &&
    filters.status[0] === 'PAID' &&
    filters.extPaymentDate === 'null'

  return {
    ...formValues,
    status: isSentToBank ? [MY_IAP_SENT_TO_BANK_FILTER_VALUE] : filters.status,
  }
}

export const toApiFilters = (
  values: MyClaimRequestsFilterFormValues
): MyClaimRequestsFilterValues => {
  const { status, ...filters } = values

  if (status?.includes(MY_IAP_SENT_TO_BANK_FILTER_VALUE)) {
    return {
      ...filters,
      status: ['PAID'],
      extPaymentDate: 'null',
    }
  }
  if (status?.includes('PAID')) {
    return {
      ...filters,
      status: ['PAID'],
      extPaymentDate__neq: 'null',
    }
  }

  const claimRequestStatuses = status?.filter(
    (status): status is ClaimRequestStatus =>
      status !== MY_IAP_SENT_TO_BANK_FILTER_VALUE && status !== 'PAID'
  )

  return {
    ...filters,
    status: claimRequestStatuses?.length ? claimRequestStatuses : undefined,
  }
}
