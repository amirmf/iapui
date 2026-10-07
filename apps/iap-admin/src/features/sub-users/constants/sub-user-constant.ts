import type { PartyRole } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const DOCTOR_USER_ROLE: PartyRole = 'ROLE_DOCTOR_USER'

export const subUserStatusColors: Record<'enabled' | 'disabled', string> = {
  disabled: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  enabled:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
}

export const SUB_USER_ROLES: PartyRole[] = [
  'ROLE_REQUEST_REGISTERY_AGENT',
  'ROLE_ASSESSMENT_USER',
  DOCTOR_USER_ROLE,
]

export function getSubUserRoleOptions(t: TFunction) {
  return [
    {
      label: t('parties.role.requestRegisteryAgent') as string,
      value: 'ROLE_REQUEST_REGISTERY_AGENT',
    },
    {
      label: t('parties.role.assessmentUser') as string,
      value: 'ROLE_ASSESSMENT_USER',
    },
    {
      label: t('parties.role.doctorUser') as string,
      value: DOCTOR_USER_ROLE,
    },
  ]
}
