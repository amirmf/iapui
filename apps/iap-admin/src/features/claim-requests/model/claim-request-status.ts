import type {
  AiAssessmentResultAssessType,
  AiAssessmentResultResolutionType,
  ClaimRequestAiStatus,
  ClaimRequestDuplicateType,
  ClaimRequestObjectionRoleType,
  ClaimRequestStatus,
  DuplicateValidatorType,
} from '@iap/api-types'

export const claimRequestStatusColors = {
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
} as const satisfies Record<ClaimRequestStatus, string>

export const claimRequestAiStatusColors = {
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
} as const satisfies Record<ClaimRequestAiStatus, string>

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

export const claimStatusBorderColors = {
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
} as const satisfies Record<ClaimRequestStatus, string>

export const aiStatusBorderColors = {
  APPROVED: 'border-green-400 hover:border-green-600',
  RETURN: 'border-red-400 hover:border-red-600',
  REVIEW_REQUIRED: 'border-yellow-400 hover:border-yellow-600',
  REVIEW_REQUIRED_SUBMIT_INFO_DUPLICATED:
    'border-yellow-400 hover:border-yellow-600',
  REVIEW_REQUIRED_IMAGE_DUPLICATED: 'border-yellow-400 hover:border-yellow-600',
  REVIEW_REQUIRED_IMAGE_DIGITALLY_EDITED:
    'border-yellow-400 hover:border-yellow-600',
  RETURN_NO_COVERAGE: 'border-red-400 hover:border-red-600',
  RETURN_MAX_CEILING: 'border-red-400 hover:border-red-600',
  REJECT: 'border-red-400 hover:border-red-600',
} as const satisfies Record<ClaimRequestAiStatus, string>

export const CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS = {
  IMAGE: 'claimRequests.duplicates.type.image',
  INFORMATION: 'claimRequests.duplicates.type.information',
  INFORMATION_EXTERNAL_CORE:
    'claimRequests.duplicates.type.informationExternalCore',
  INFORMATION_EXTERNAL_FANHUB:
    'claimRequests.duplicates.type.informationExternalFanhub',
} as const satisfies Record<
  ClaimRequestDuplicateType,
  `claimRequests.duplicates.type.${string}`
>

export const CLAIM_REQUEST_DUPLICATE_TYPE_BADGE_COLORS = {
  IMAGE:
    'border-violet-200 bg-violet-100/30 text-violet-900 dark:text-violet-200',
  INFORMATION:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  INFORMATION_EXTERNAL_CORE:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  INFORMATION_EXTERNAL_FANHUB:
    'border-emerald-200 bg-emerald-100/30 text-emerald-900 dark:text-emerald-200',
} as const satisfies Record<ClaimRequestDuplicateType, string>

export const CLAIM_REQUEST_DUPLICATE_TYPE_BOX_COLORS = {
  IMAGE: 'border-violet-200 bg-violet-100/10',
  INFORMATION: 'border-amber-200 bg-amber-100/10',
  INFORMATION_EXTERNAL_CORE: 'border-blue-200 bg-blue-100/10',
  INFORMATION_EXTERNAL_FANHUB: 'border-emerald-200 bg-emerald-100/10',
} as const satisfies Record<ClaimRequestDuplicateType, string>

export const CLAIM_REQUEST_OBJECTION_ROLE_TYPE_TRANSLATION_KEYS = {
  ENDUSER: 'claimRequests.objectionRoleTypes.endUser',
  EXPERT: 'claimRequests.objectionRoleTypes.expert',
  AI: 'claimRequests.objectionRoleTypes.ai',
} as const satisfies Record<
  ClaimRequestObjectionRoleType,
  `claimRequests.objectionRoleTypes.${string}`
>

export const AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_TRANSLATION_KEYS = {
  NONE: 'claimRequests.aiAssessmentResolutionTypes.none',
  RETURN: 'claimRequests.aiAssessmentResolutionTypes.return',
  REJECT: 'claimRequests.aiAssessmentResolutionTypes.reject',
  APPROVE: 'claimRequests.aiAssessmentResolutionTypes.approve',
} as const satisfies Record<
  AiAssessmentResultResolutionType,
  `claimRequests.aiAssessmentResolutionTypes.${string}`
>

export const AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_BADGE_COLORS = {
  NONE: 'border-border bg-muted text-muted-foreground',
  RETURN: 'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  REJECT: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  APPROVE:
    'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
} as const satisfies Record<AiAssessmentResultResolutionType, string>

export const AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_CARD_COLORS = {
  NONE: 'border-border bg-muted/20',
  RETURN: 'border-amber-200 bg-amber-100/10',
  REJECT: 'border-red-200 bg-red-100/10',
  APPROVE: 'border-green-200 bg-green-100/10',
} as const satisfies Record<AiAssessmentResultResolutionType, string>

export const AI_ASSESSMENT_RESULT_ASSESS_TYPE_TRANSLATION_KEYS = {
  DUPLICATION: 'claimRequests.aiAssessmentResultAssessTypes.duplication',
  CORE_MISMATCH: 'claimRequests.aiAssessmentResultAssessTypes.coreMismatch',
  NO_CEILING: 'claimRequests.aiAssessmentResultAssessTypes.noCeiling',
  NO_COVERAGE: 'claimRequests.aiAssessmentResultAssessTypes.noCoverage',
  IMAGE_DIGITALLY_EDITED:
    'claimRequests.aiAssessmentResultAssessTypes.imageDigitallyEdited',
  NAME_MISMATCH: 'claimRequests.aiAssessmentResultAssessTypes.nameMismatch',
  DATE_MISMATCH: 'claimRequests.aiAssessmentResultAssessTypes.dateMismatch',
  DOCTOR_MISMATCH: 'claimRequests.aiAssessmentResultAssessTypes.doctorMismatch',
  MEDICAL_CENTER_MISMATCH:
    'claimRequests.aiAssessmentResultAssessTypes.medicalCenterMismatch',
  DOCS_MISMATCH: 'claimRequests.aiAssessmentResultAssessTypes.docsMismatch',
  INFORMATION_MISMATCH:
    'claimRequests.aiAssessmentResultAssessTypes.informationMismatch',
  UNUSUAL_REQUEST_AMOUNT:
    'claimRequests.aiAssessmentResultAssessTypes.unusualRequestAmount',
  CALCULATION: 'claimRequests.aiAssessmentResultAssessTypes.calculation',
  UNUSUAL_APPROVE_AMOUNT:
    'claimRequests.aiAssessmentResultAssessTypes.unusualApproveAmount',
  APPROVE: 'claimRequests.aiAssessmentResultAssessTypes.approve',
  EXPERT_UNUSUAL_CALCULATION:
    'claimRequests.aiAssessmentResultAssessTypes.expertUnusualCalculation',
  EXPERT_UNUSUAL_CALCULATION_EXCEED_TARIFF:
    'claimRequests.aiAssessmentResultAssessTypes.expertUnusualCalculationExceedTariff',
  NEED_SECOND_APPROVE:
    'claimRequests.aiAssessmentResultAssessTypes.needSecondApprove',
} as const satisfies Record<
  AiAssessmentResultAssessType,
  `claimRequests.aiAssessmentResultAssessTypes.${string}`
>

export const AI_ASSESSMENT_RESULT_ASSESS_TYPE_BADGE_COLORS = {
  DUPLICATION:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  CORE_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  NO_CEILING:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  NO_COVERAGE:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  IMAGE_DIGITALLY_EDITED:
    'border-violet-200 bg-violet-100/30 text-violet-900 dark:text-violet-200',
  NAME_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  DATE_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  DOCTOR_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  MEDICAL_CENTER_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  DOCS_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  INFORMATION_MISMATCH:
    'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
  UNUSUAL_REQUEST_AMOUNT:
    'border-orange-200 bg-orange-100/30 text-orange-900 dark:text-orange-200',
  CALCULATION:
    'border-indigo-200 bg-indigo-100/30 text-indigo-900 dark:text-indigo-200',
  UNUSUAL_APPROVE_AMOUNT:
    'border-orange-200 bg-orange-100/30 text-orange-900 dark:text-orange-200',
  APPROVE:
    'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
  EXPERT_UNUSUAL_CALCULATION:
    'border-orange-200 bg-orange-100/30 text-orange-900 dark:text-orange-200',
  EXPERT_UNUSUAL_CALCULATION_EXCEED_TARIFF:
    'border-orange-200 bg-orange-100/30 text-orange-900 dark:text-orange-200',
  NEED_SECOND_APPROVE:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
} as const satisfies Record<AiAssessmentResultAssessType, string>

export const DUPLICATE_VALIDATOR_TYPE_TRANSLATION_KEYS = {
  GENERAL: 'claimRequests.duplicateValidatorTypes.general',
} as const satisfies Record<
  DuplicateValidatorType,
  `claimRequests.duplicateValidatorTypes.${string}`
>

export const CLAIM_OBJECTION_REQUEST_STATUSES = [
  'APPROVED',
  'RETURN',
  'REJECTED',
] as const
export const CLAIM_OBJECTION_REQUEST_STATUS_TRANSLATION_KEYS = {
  APPROVED: 'claimRequests.status.objections.approved',
  REJECTED: 'claimRequests.status.objections.rejected',
  RETURN: 'claimRequests.status.objections.return',
} as const satisfies Record<
  (typeof CLAIM_OBJECTION_REQUEST_STATUSES)[number],
  string
>
