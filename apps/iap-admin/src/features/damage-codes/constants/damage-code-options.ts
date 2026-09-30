import type { DamageCodeStatus, PriceType } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const damageCodeStatusColors: Record<DamageCodeStatus, string> = {
  ACTIVE:
    'border-emerald-200 bg-emerald-100/30 text-emerald-900 dark:text-emerald-200',
  DEPRECATED: 'border-red-200 bg-red-100/30 text-red-900 dark:text-red-200',
  INACTIVE: 'border-gray-200 bg-gray-100/30 text-gray-900 dark:text-gray-200',
  PENDING:
    'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
}

export const damageCodeStatusTranslationKeys: Record<
  DamageCodeStatus,
  `damageCodes.status.${Lowercase<DamageCodeStatus>}`
> = {
  ACTIVE: 'damageCodes.status.active',
  DEPRECATED: 'damageCodes.status.deprecated',
  INACTIVE: 'damageCodes.status.inactive',
  PENDING: 'damageCodes.status.pending',
}

export const damageCodePriceTypeColors: Record<PriceType, string> = {
  BASE_ANESTHESIA_VALUE:
    'border-orange-200 bg-orange-100/30 text-orange-900 dark:text-orange-200',
  BASIC_INSURANCE_SHARE:
    'border-slate-200 bg-slate-100/30 text-slate-900 dark:text-slate-200',
  CHARITY_SECTOR_SUPPLEMENTARY_INSURANCE:
    'border-lime-200 bg-lime-100/30 text-lime-900 dark:text-lime-200',
  CHARITY_SECTOR_TARIFF:
    'border-emerald-200 bg-emerald-100/30 text-emerald-900 dark:text-emerald-200',
  GOVERNMENT_SECTOR_SUPPLEMENTARY_INSURANCE:
    'border-cyan-200 bg-cyan-100/30 text-cyan-900 dark:text-cyan-200',
  GOVERNMENT_SECTOR_TARIFF:
    'border-teal-200 bg-teal-100/30 text-teal-900 dark:text-teal-200',
  PRIVATE_SECTOR_SUPPLEMENTARY_INSURANCE:
    'border-indigo-200 bg-indigo-100/30 text-indigo-900 dark:text-indigo-200',
  PRIVATE_SECTOR_TARIFF:
    'border-pink-200 bg-pink-100/30 text-pink-900 dark:text-pink-200',
  PROFESSIONAL:
    'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
  PUBLIC_NON_GOVERNMENT_SECTOR_TARIFF:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  PUBLIC_NON_GOVERNMENT_SUPPLEMENTARY_INSURANCE:
    'border-rose-200 bg-rose-100/30 text-rose-900 dark:text-rose-200',
  TECHNICAL:
    'border-purple-200 bg-purple-100/30 text-purple-900 dark:text-purple-200',
  TEETH_GENERAL_DOCTOR:
    'border-yellow-200 bg-yellow-100/30 text-yellow-900 dark:text-yellow-200',
  TEETH_SPECIAL_DOCTOR:
    'border-fuchsia-200 bg-fuchsia-100/30 text-fuchsia-900 dark:text-fuchsia-200',
  TOTAL: 'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
}

export const damageCodePriceTypeTranslationKeys: Record<
  PriceType,
  `damageCodes.pricing.types.${string}`
> = {
  BASE_ANESTHESIA_VALUE: 'damageCodes.pricing.types.baseanesthesiavalue',
  BASIC_INSURANCE_SHARE: 'damageCodes.pricing.types.basicinsuranceshare',
  CHARITY_SECTOR_SUPPLEMENTARY_INSURANCE:
    'damageCodes.pricing.types.charitysectorsupplementaryinsurance',
  CHARITY_SECTOR_TARIFF: 'damageCodes.pricing.types.charitysectortariff',
  GOVERNMENT_SECTOR_SUPPLEMENTARY_INSURANCE:
    'damageCodes.pricing.types.governmentsectorsupplementaryinsurance',
  GOVERNMENT_SECTOR_TARIFF: 'damageCodes.pricing.types.governmentsectortariff',
  PRIVATE_SECTOR_SUPPLEMENTARY_INSURANCE:
    'damageCodes.pricing.types.privatesectorsupplementaryinsurance',
  PRIVATE_SECTOR_TARIFF: 'damageCodes.pricing.types.privatesectortariff',
  PROFESSIONAL: 'damageCodes.pricing.types.professional',
  PUBLIC_NON_GOVERNMENT_SECTOR_TARIFF:
    'damageCodes.pricing.types.publicnongovernmentsectortariff',
  PUBLIC_NON_GOVERNMENT_SUPPLEMENTARY_INSURANCE:
    'damageCodes.pricing.types.publicnongovernmentsupplementaryinsurance',
  TECHNICAL: 'damageCodes.pricing.types.technical',
  TEETH_GENERAL_DOCTOR: 'damageCodes.pricing.types.teethgeneraldoctor',
  TEETH_SPECIAL_DOCTOR: 'damageCodes.pricing.types.teethspecialdoctor',
  TOTAL: 'damageCodes.pricing.types.total',
}

export function getDamageCodeStatusOptions(t: TFunction) {
  return Object.entries(damageCodeStatusTranslationKeys).map(
    ([value, key]) => ({
      label: t(key as never),
      value: value as DamageCodeStatus,
    })
  )
}

export function getDamageCodePriceTypeOptions(t: TFunction) {
  return Object.entries(damageCodePriceTypeTranslationKeys).map(
    ([value, key]) => ({ label: t(key as never), value: value as PriceType })
  )
}
