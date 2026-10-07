import {
  type AssessmentItemToothType,
  type ClaimRequestAdjustmentStatus,
  type TariffEnumType,
} from '@iap/api-types'
import { type TFunction } from 'i18next'

export const ASSESSMENT_ITEMS_TOOTH_TYPE_TRANSLATION_KEYS = {
  PERMANENT:
    'assessmentItems.dialog.toothAssessment.fields.toothTypes.permanent',
  DECIDUOUS:
    'assessmentItems.dialog.toothAssessment.fields.toothTypes.deciduous',
} as const satisfies Record<
  AssessmentItemToothType,
  `assessmentItems.dialog.toothAssessment.fields.toothTypes.${string}`
>

export const getAgreementItemsToothTypeOptions = (t: TFunction) => {
  const statuses: AssessmentItemToothType[] = ['PERMANENT', 'DECIDUOUS']
  return statuses.map((status) => ({
    label: t(ASSESSMENT_ITEMS_TOOTH_TYPE_TRANSLATION_KEYS[status]),
    value: status,
  }))
}

export const ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_TRANSLATION_KEYS =
  {
    SUBMITTED: 'assessmentItems.adjustment.status.submitted',
    APPROVED: 'assessmentItems.adjustment.status.approved',
    SENT: 'assessmentItems.adjustment.status.send',
    SENT_FAILED: 'assessmentItems.adjustment.status.sent_failed',
    TERMINATED: 'assessmentItems.adjustment.status.terminated',
    PAYMENT_REJECTED: 'assessmentItems.adjustment.status.paymentRejected',
    PAID: 'assessmentItems.adjustment.status.paid',
  } as const satisfies Record<
    ClaimRequestAdjustmentStatus,
    `assessmentItems.adjustment.status.${string}`
  >

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

export const getAssessmentItemsClaimRequestAdjustmentStatusOptions = (
  t: TFunction
) => {
  const statuses: ClaimRequestAdjustmentStatus[] = [
    'SUBMITTED',
    'APPROVED',
    'SENT',
    'SENT_FAILED',
    'TERMINATED',
    'PAYMENT_REJECTED',
    'PAID',
  ]

  return statuses.map((status) => ({
    label: t(
      ASSESSMENT_ITEMS_CLAIM_REQUEST_ADJUSTMENT_STATUS_TRANSLATION_KEYS[status]
    ),
    value: status,
  }))
}

export const ASSESSMENT_ITEMS_TARIFF_TRANSLATE_KEY = {
  PRIVATE_SECTOR_TARIFF: 'assessmentItems.dialog.tariff.privateSectorTariff',
  PRIVATE_SECTOR_SUPPLEMENTARY_INSURANCE:
    'assessmentItems.dialog.tariff.privateSectorSupplementaryInsurance',
  GOVERNMENT_SECTOR_TARIFF:
    'assessmentItems.dialog.tariff.governmentSectorTariff',
  PUBLIC_NON_GOVERNMENT_SECTOR_TARIFF:
    'assessmentItems.dialog.tariff.publicNonGovernmentSectorTariff',
  CHARITY_SECTOR_TARIFF: 'assessmentItems.dialog.tariff.charitySectorTariff',
  TEETH_GENERAL_DOCTOR: 'assessmentItems.dialog.tariff.teethGeneralDoctor',
  TEETH_SPECIAL_DOCTOR: 'assessmentItems.dialog.tariff.teethSpecialDoctor',
} as const satisfies Record<
  TariffEnumType,
  `assessmentItems.dialog.tariff.${string}`
>
