import type { CoverageDamageCodeApplStatus } from '@iap/api-types'

export const coverageDamageCodeApplStatusTranslationKeys: Record<
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
  ACTIVE: 'border-green-200 bg-green-100/30 text-green-900 dark:text-green-200',
  INACTIVE:
    'border-slate-200 bg-slate-200/30 text-slate-900 dark:text-slate-200',
  SUSPENDED:
    'border-amber-200 bg-amber-100/30 text-amber-900 dark:text-amber-200',
  PENDING: 'border-blue-200 bg-blue-100/30 text-blue-900 dark:text-blue-200',
}
