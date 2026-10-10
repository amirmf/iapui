import type { ClaimRequestStatus } from '@iap/api-types'

export const claimStatusColors: Record<ClaimRequestStatus, string> = {
  SUBMITTED:
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  IN_REVIEW: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  IN_ASSESSMENT:
    'bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200',
  DELEGATED: 'bg-cyan-100/30 text-cyan-900 dark:text-cyan-200 border-cyan-200',
  DEDICATED_TO_USER:
    'bg-cyan-100/30 text-cyan-900 dark:text-cyan-200 border-cyan-200',
  APPROVED:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  REJECTED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  FAILED_FETCH_API:
    'bg-gray-100/30 text-gray-900 dark:text-gray-200 border-gray-200',
  SENT: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  SENT_FAILED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PAID: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  TERMINATED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  RETURN: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PAYMENT_REJECTED:
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PAYMENT_RETURN: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PAYMENT_RETURN_RESEND:
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  DELETED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
}

export const claimStatusBorderColors: Record<ClaimRequestStatus, string> = {
  SUBMITTED: 'border-yellow-400 hover:border-yellow-600',
  IN_REVIEW: 'border-blue-400 hover:border-blue-600',
  IN_ASSESSMENT: 'border-indigo-400 hover:border-indigo-600',
  DELEGATED: 'border-cyan-400 hover:border-cyan-600',
  DEDICATED_TO_USER: 'border-cyan-400 hover:border-cyan-600',
  APPROVED: 'border-green-400 hover:border-green-600',
  REJECTED: 'border-red-400 hover:border-red-600',
  FAILED_FETCH_API: 'border-gray-400 hover:border-gray-600',
  SENT: 'border-blue-400 hover:border-blue-600',
  SENT_FAILED: 'border-red-400 hover:border-red-600',
  PAID: 'border-green-400 hover:border-green-600',
  TERMINATED: 'border-red-400 hover:border-red-600',
  RETURN: 'border-red-400 hover:border-red-600',
  PAYMENT_REJECTED: 'border-red-400 hover:border-red-600',
  PAYMENT_RETURN: 'border-red-400 hover:border-red-600',
  PAYMENT_RETURN_RESEND: 'border-red-400 hover:border-red-600',
  DELETED: 'border-red-400 hover:border-red-600',
}

export const CLAIM_REQUEST_STATUS_TRANSLATION_KEYS = {
  SUBMITTED: 'claimRequests.status.submitted',
  IN_REVIEW: 'claimRequests.status.inReview',
  IN_ASSESSMENT: 'claimRequests.status.inAssessment',
  DELEGATED: 'claimRequests.status.delegated',
  DEDICATED_TO_USER: 'claimRequests.status.dedicatedToUser',
  APPROVED: 'claimRequests.status.approved',
  REJECTED: 'claimRequests.status.rejected',
  FAILED_FETCH_API: 'claimRequests.status.failed_fetch_api',
  SENT: 'claimRequests.status.sent',
  SENT_FAILED: 'claimRequests.status.sent_failed',
  PAID: 'claimRequests.status.paid',
  TERMINATED: 'claimRequests.status.terminated',
  RETURN: 'claimRequests.status.return',
  PAYMENT_REJECTED: 'claimRequests.status.paymentRejected',
  PAYMENT_RETURN: 'claimRequests.status.paymentReturn',
  PAYMENT_RETURN_RESEND: 'claimRequests.status.paymentReturnResend',
  DELETED: 'claimRequests.status.deleted',
} as const satisfies Record<
  ClaimRequestStatus,
  `claimRequests.status.${string}`
>

export const CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP = {
  ...CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  DELEGATED: 'claimRequests.status.inAssessment',
  DEDICATED_TO_USER: 'claimRequests.status.inAssessment',
  SENT_FAILED: 'claimRequests.status.inAssessment',
  SENT: 'claimRequests.status.send_customer',
} as const

export const MY_IAP_SENT_TO_BANK_FILTER_VALUE = 'SENT_TO_BANK' as const

export type MyIapClaimRequestStatusFilterValue =
  ClaimRequestStatus | typeof MY_IAP_SENT_TO_BANK_FILTER_VALUE

export const getClaimRequestStatusOptionsIAP = (
  t: (
    key:
      | (typeof CLAIM_REQUEST_STATUS_TRANSLATION_KEYS)[ClaimRequestStatus]
      | 'claimRequests.status.sentToBank'
  ) => string
): Array<{ label: string; value: MyIapClaimRequestStatusFilterValue }> => {
  const status: ClaimRequestStatus[] = [
    'IN_REVIEW',
    'APPROVED',
    'REJECTED',
    'SENT',
    'RETURN',
    'PAID',
  ]
  return [
    ...status.map((status) => ({
      label: t(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[status]),
      value: status,
    })),
    {
      label: t('claimRequests.status.sentToBank'),
      value: MY_IAP_SENT_TO_BANK_FILTER_VALUE,
    },
  ]
}
