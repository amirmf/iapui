import type { ClaimRequestAdjustmentStatus } from '@iap/api-types'

export const ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_TRANSLATION_KEYS =
  {
    SUBMITTED: 'assessmentItems.adjustment.status.submitted',
    APPROVED: 'assessmentItems.adjustment.status.approved',
    SENT: 'assessmentItems.adjustment.status.send',
    SENT_FAILED: 'assessmentItems.adjustment.status.sent_failed',
    TERMINATED: 'assessmentItems.adjustment.status.terminated',
    PAYMENT_REJECTED: 'assessmentItems.adjustment.status.paymentRejected',
    PAID: 'assessmentItems.adjustment.status.paid',
  } as const satisfies Record<ClaimRequestAdjustmentStatus, string>

export const ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_COLORS: Record<
  ClaimRequestAdjustmentStatus,
  string
> = {
  SUBMITTED:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  APPROVED:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  SENT: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  SENT_FAILED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  TERMINATED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PAYMENT_REJECTED:
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  PAID: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
}
