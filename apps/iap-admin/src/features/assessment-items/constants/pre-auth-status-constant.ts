import { type TFunction } from 'i18next'

export type PreAuthStatus = 101 | 102 | 103

export const preAuthStatusColors: Record<PreAuthStatus, string> = {
  101: 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  102: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  103: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
}

export const preAuthStatusBorderColors: Record<PreAuthStatus, string> = {
  101: 'border-yellow-400 hover:border-yellow-600',
  102: 'border-green-400 hover:border-green-600',
  103: 'border-red-400 hover:border-red-600',
}

export const PRE_AUTH_STATUS_TRANSLATION_KEYS = {
  101: 'myiap.preAuths.status.draft',
  102: 'myiap.preAuths.status.approved',
  103: 'myiap.preAuths.status.cancelled',
} as const satisfies Record<PreAuthStatus, `myiap.preAuths.status.${string}`>

export const getPreAuthStatusOptions = (
  t: TFunction
): Array<{ label: string; value: PreAuthStatus }> => {
  return Object.entries(PRE_AUTH_STATUS_TRANSLATION_KEYS).map(
    ([status, translationKey]) => ({
      label: t(translationKey),
      value: parseInt(status) as PreAuthStatus,
    })
  )
}
