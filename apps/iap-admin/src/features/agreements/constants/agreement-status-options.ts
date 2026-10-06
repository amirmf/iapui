import type { AgreementStatus } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const agreementStatusTranslationKeys: Record<
  AgreementStatus,
  `agreements.status.${string}`
> = {
  ACTIVE: 'agreements.status.active',
  DRAFT: 'agreements.status.draft',
  EXPIRED: 'agreements.status.expired',
  INACTIVE: 'agreements.status.inactive',
  TERMINATED: 'agreements.status.terminated',
}
export const agreementStatusClasses: Record<AgreementStatus, string> = {
  ACTIVE:
    'border-emerald-200 bg-emerald-100/30 text-emerald-900 dark:text-emerald-200',
  DRAFT:
    'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
  EXPIRED: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  INACTIVE: 'border-gray-200 bg-gray-100/30 text-gray-900 dark:text-gray-200',
  TERMINATED:
    'border-purple-200 bg-purple-100/30 text-purple-900 dark:text-purple-200',
}
export const AGREEMENT_STATUS_TRANSLATION_KEYS = agreementStatusTranslationKeys
export const AGREEMENT_STATUS_COLORS = agreementStatusClasses
export function getAgreementStatusOptions(t: TFunction) {
  return (
    ['ACTIVE', 'INACTIVE', 'DRAFT', 'EXPIRED', 'TERMINATED'] as const
  ).map((value) => ({
    label: String(t(agreementStatusTranslationKeys[value] as never)),
    value,
  }))
}
