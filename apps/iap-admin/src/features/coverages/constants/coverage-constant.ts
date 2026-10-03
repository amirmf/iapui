import type {
  CoverageDamageCodeApplStatus,
  CoverageStatus,
  CoverageType,
} from '@iap/api-types'
import type { TFunction } from 'i18next'

export const COVERAGE_STATUS_TRANSLATION_KEYS: Record<
  CoverageStatus,
  `coverages.status.${string}`
> = {
  ACTIVE: 'coverages.status.active',
  INACTIVE: 'coverages.status.inactive',
  SUSPENDED: 'coverages.status.suspended',
  PENDING: 'coverages.status.pending',
}

export const coverageStatusBadgeColors: Record<CoverageStatus, string> = {
  ACTIVE: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  INACTIVE:
    'bg-slate-200/30 text-slate-900 dark:text-slate-200 border-slate-200',
  SUSPENDED:
    'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
  PENDING: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
}

export const coverageStatusBorderColors: Record<CoverageStatus, string> = {
  ACTIVE: 'border-green-400 hover:border-green-600',
  INACTIVE: 'border-slate-400 hover:border-slate-600',
  SUSPENDED: 'border-amber-400 hover:border-amber-600',
  PENDING: 'border-blue-400 hover:border-blue-600',
}

export const getCoverageStatusOptions = (
  t: TFunction
): Array<{ label: string; value: CoverageStatus }> =>
  (Object.keys(COVERAGE_STATUS_TRANSLATION_KEYS) as CoverageStatus[]).map(
    (status) => ({
      label: t(COVERAGE_STATUS_TRANSLATION_KEYS[status] as never),
      value: status,
    })
  )

export const COVERAGE_DAMAGE_CODE_APPL_STATUS_TRANSLATION_KEYS: Record<
  CoverageDamageCodeApplStatus,
  `coverageDamageCodeAppls.status.${string}`
> = {
  ACTIVE: 'coverageDamageCodeAppls.status.active',
  INACTIVE: 'coverageDamageCodeAppls.status.inactive',
  SUSPENDED: 'coverageDamageCodeAppls.status.suspended',
  PENDING: 'coverageDamageCodeAppls.status.pending',
}

export const coverageDamageCodeApplStatusBadgeColors: Record<
  CoverageDamageCodeApplStatus,
  string
> = {
  ACTIVE: coverageStatusBadgeColors.ACTIVE,
  INACTIVE: coverageStatusBadgeColors.INACTIVE,
  SUSPENDED: coverageStatusBadgeColors.SUSPENDED,
  PENDING: coverageStatusBadgeColors.PENDING,
}

export const coverageDamageCodeApplStatusBorderColors: Record<
  CoverageDamageCodeApplStatus,
  string
> = {
  ACTIVE: coverageStatusBorderColors.ACTIVE,
  INACTIVE: coverageStatusBorderColors.INACTIVE,
  SUSPENDED: coverageStatusBorderColors.SUSPENDED,
  PENDING: coverageStatusBorderColors.PENDING,
}

export const getCoverageDamageCodeApplStatusOptions = (
  t: TFunction
): Array<{ label: string; value: CoverageDamageCodeApplStatus }> =>
  (
    Object.keys(
      COVERAGE_DAMAGE_CODE_APPL_STATUS_TRANSLATION_KEYS
    ) as CoverageDamageCodeApplStatus[]
  ).map((status) => ({
    label: t(
      COVERAGE_DAMAGE_CODE_APPL_STATUS_TRANSLATION_KEYS[status] as never
    ),
    value: status,
  }))

export const COVERAGE_TYPE_TRANSLATION_KEYS: Record<
  CoverageType,
  `coverages.type.${string}`
> = {
  GROUP: 'coverages.type.group',
  DETAIL: 'coverages.type.detail',
}

export const coverageTypeBadgeColors: Record<CoverageType, string> = {
  GROUP: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  DETAIL:
    'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200',
}

export const getCoverageTypeOptions = (
  t: TFunction
): Array<{ label: string; value: CoverageType }> =>
  (Object.keys(COVERAGE_TYPE_TRANSLATION_KEYS) as CoverageType[]).map(
    (type) => ({
      label: t(COVERAGE_TYPE_TRANSLATION_KEYS[type] as never),
      value: type,
    })
  )

// Preserve the target feature's existing public imports while exposing the
// reference names above as the canonical constant surface.
export const coverageStatusTranslationKeys = COVERAGE_STATUS_TRANSLATION_KEYS
export const coverageDamageCodeApplStatusTranslationKeys =
  COVERAGE_DAMAGE_CODE_APPL_STATUS_TRANSLATION_KEYS
export const coverageTypeTranslationKeys = COVERAGE_TYPE_TRANSLATION_KEYS
