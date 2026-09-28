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

export const claimRequestStatusTranslationKeys: Record<
  ClaimRequestStatus,
  | 'claimRequests.status.approved'
  | 'claimRequests.status.dedicatedToUser'
  | 'claimRequests.status.delegated'
  | 'claimRequests.status.deleted'
  | 'claimRequests.status.failed_fetch_api'
  | 'claimRequests.status.inAssessment'
  | 'claimRequests.status.inReview'
  | 'claimRequests.status.paid'
  | 'claimRequests.status.paymentRejected'
  | 'claimRequests.status.paymentReturn'
  | 'claimRequests.status.paymentReturnResend'
  | 'claimRequests.status.rejected'
  | 'claimRequests.status.return'
  | 'claimRequests.status.sent'
  | 'claimRequests.status.sent_failed'
  | 'claimRequests.status.submitted'
  | 'claimRequests.status.terminated'
> = {
  APPROVED: 'claimRequests.status.approved',
  DEDICATED_TO_USER: 'claimRequests.status.dedicatedToUser',
  DELEGATED: 'claimRequests.status.delegated',
  DELETED: 'claimRequests.status.deleted',
  FAILED_FETCH_API: 'claimRequests.status.failed_fetch_api',
  IN_ASSESSMENT: 'claimRequests.status.inAssessment',
  IN_REVIEW: 'claimRequests.status.inReview',
  PAID: 'claimRequests.status.paid',
  PAYMENT_REJECTED: 'claimRequests.status.paymentRejected',
  PAYMENT_RETURN: 'claimRequests.status.paymentReturn',
  PAYMENT_RETURN_RESEND: 'claimRequests.status.paymentReturnResend',
  REJECTED: 'claimRequests.status.rejected',
  RETURN: 'claimRequests.status.return',
  SENT: 'claimRequests.status.sent',
  SENT_FAILED: 'claimRequests.status.sent_failed',
  SUBMITTED: 'claimRequests.status.submitted',
  TERMINATED: 'claimRequests.status.terminated',
}

export const claimRequestAiStatusTranslationKeys: Record<
  ClaimRequestAiStatus,
  | 'claimRequests.aiStatus.approved'
  | 'claimRequests.aiStatus.reject'
  | 'claimRequests.aiStatus.return'
  | 'claimRequests.aiStatus.returnMaxCeiling'
  | 'claimRequests.aiStatus.returnNoCoverage'
  | 'claimRequests.aiStatus.reviewRequired'
  | 'claimRequests.aiStatus.reviewRequiredImageDigitallyEdited'
  | 'claimRequests.aiStatus.reviewRequiredImageDuplicated'
  | 'claimRequests.aiStatus.reviewRequiredSubmitInfoDuplicated'
> = {
  APPROVED: 'claimRequests.aiStatus.approved',
  REJECT: 'claimRequests.aiStatus.reject',
  RETURN: 'claimRequests.aiStatus.return',
  RETURN_MAX_CEILING: 'claimRequests.aiStatus.returnMaxCeiling',
  RETURN_NO_COVERAGE: 'claimRequests.aiStatus.returnNoCoverage',
  REVIEW_REQUIRED: 'claimRequests.aiStatus.reviewRequired',
  REVIEW_REQUIRED_IMAGE_DIGITALLY_EDITED:
    'claimRequests.aiStatus.reviewRequiredImageDigitallyEdited',
  REVIEW_REQUIRED_IMAGE_DUPLICATED:
    'claimRequests.aiStatus.reviewRequiredImageDuplicated',
  REVIEW_REQUIRED_SUBMIT_INFO_DUPLICATED:
    'claimRequests.aiStatus.reviewRequiredSubmitInfoDuplicated',
}
