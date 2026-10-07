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
} as const

export type ClaimRequestStatus =
  keyof typeof CLAIM_REQUEST_STATUS_TRANSLATION_KEYS

export const CLAIM_REQUEST_STATUS_TRANSLATION_KEYS_MY_IAP = {
  ...CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  DELEGATED: 'claimRequests.status.inAssessment',
  DEDICATED_TO_USER: 'claimRequests.status.inAssessment',
  SENT_FAILED: 'claimRequests.status.inAssessment',
  SENT: 'claimRequests.status.send_customer',
}

export { TICKET_STATUS_TRANSLATION_KEYS } from '../../model/ticket-status'
