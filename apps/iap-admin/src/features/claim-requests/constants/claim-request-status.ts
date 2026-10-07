import type { ClaimRequestAiStatus, ClaimRequestStatus } from '@iap/api-types'

export const claimRequestStatusColors: Record<ClaimRequestStatus, string> = {
  APPROVED:
    'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
  DEDICATED_TO_USER:
    'border-cyan-200 bg-cyan-100/30 text-cyan-900 dark:text-cyan-200',
  DELEGATED: 'border-cyan-200 bg-cyan-100/30 text-cyan-900 dark:text-cyan-200',
  DELETED: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  FAILED_FETCH_API:
    'border-gray-200 bg-gray-100/30 text-gray-900 dark:text-gray-200',
  IN_ASSESSMENT:
    'border-indigo-200 bg-indigo-100/30 text-indigo-900 dark:text-indigo-200',
  IN_REVIEW: 'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  PAID: 'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
  PAYMENT_REJECTED:
    'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  PAYMENT_RETURN: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  PAYMENT_RETURN_RESEND:
    'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  REJECTED: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  RETURN: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  SENT: 'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  SENT_FAILED: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  SUBMITTED:
    'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
  TERMINATED: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
}

export const claimRequestAiStatusColors: Record<ClaimRequestAiStatus, string> =
  {
    APPROVED:
      'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
    REJECT: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
    RETURN: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
    RETURN_MAX_CEILING:
      'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
    RETURN_NO_COVERAGE:
      'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
    REVIEW_REQUIRED:
      'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
    REVIEW_REQUIRED_IMAGE_DIGITALLY_EDITED:
      'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
    REVIEW_REQUIRED_IMAGE_DUPLICATED:
      'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
    REVIEW_REQUIRED_SUBMIT_INFO_DUPLICATED:
      'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
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
} as const satisfies Record<ClaimRequestStatus, string>

export const claimRequestStatusTranslationKeys =
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS

export const CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS = {
  APPROVED: 'claimRequests.aiStatus.approved',
  RETURN: 'claimRequests.aiStatus.return',
  REVIEW_REQUIRED: 'claimRequests.aiStatus.reviewRequired',
  REVIEW_REQUIRED_SUBMIT_INFO_DUPLICATED:
    'claimRequests.aiStatus.reviewRequiredSubmitInfoDuplicated',
  REVIEW_REQUIRED_IMAGE_DUPLICATED:
    'claimRequests.aiStatus.reviewRequiredImageDuplicated',
  REVIEW_REQUIRED_IMAGE_DIGITALLY_EDITED:
    'claimRequests.aiStatus.reviewRequiredImageDigitallyEdited',
  RETURN_NO_COVERAGE: 'claimRequests.aiStatus.returnNoCoverage',
  RETURN_MAX_CEILING: 'claimRequests.aiStatus.returnMaxCeiling',
  REJECT: 'claimRequests.aiStatus.reject',
} as const satisfies Record<ClaimRequestAiStatus, string>

export const claimRequestAiStatusTranslationKeys =
  CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS

export const claimStatusColors = claimRequestStatusColors
export const aiStatusColors = claimRequestAiStatusColors
export const MY_IAP_SENT_TO_BANK_FILTER_VALUE = 'SENT_TO_BANK' as const
export const CLAIM_REQUEST_REQUEST_TYPE_TRANSLATION_KEYS = {
  MAIN: 'claimRequests.requestType.main',
  ADJUSTMENT: 'claimRequests.requestType.adjustment',
} as const
export const CLAIM_REQUEST_IBAN_STATUS_TRANSLATION_KEYS = {
  Y: 'claimRequests.ibanStatusValues.has',
  N: 'claimRequests.ibanStatusValues.doesNotHave',
} as const

type TranslateClaimOption = (
  key:
    | (typeof CLAIM_REQUEST_STATUS_TRANSLATION_KEYS)[ClaimRequestStatus]
    | (typeof CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS)[ClaimRequestAiStatus]
    | (typeof CLAIM_REQUEST_REQUEST_TYPE_TRANSLATION_KEYS)[keyof typeof CLAIM_REQUEST_REQUEST_TYPE_TRANSLATION_KEYS]
) => string
export function getClaimRequestStatusOptions(t: TranslateClaimOption) {
  return Object.entries(CLAIM_REQUEST_STATUS_TRANSLATION_KEYS).map(
    ([value, key]) => ({ label: t(key), value })
  )
}
export function getClaimRequestAiStatusOptions(t: TranslateClaimOption) {
  return Object.entries(CLAIM_REQUEST_AI_STATUS_TRANSLATION_KEYS).map(
    ([value, key]) => ({ label: t(key), value })
  )
}
export function getClaimRequestRequestTypeOptions(t: TranslateClaimOption) {
  return Object.entries(CLAIM_REQUEST_REQUEST_TYPE_TRANSLATION_KEYS).map(
    ([value, key]) => ({ label: t(key), value })
  )
}
