import type { PartyRole } from '@iap/api-types'
import { nationalityTypeSchema, partyRoleSchema } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const PARTY_ROLE_TRANSLATION_KEYS: Record<
  PartyRole,
  `parties.role.${string}`
> = {
  ROLE_PUBLIC_USER: 'parties.role.publicUser',
  ROLE_MONITORING_USER: 'parties.role.monitoringUser',
  ROLE_ASSESSMENT_USER: 'parties.role.assessmentUser',
  ROLE_MAIN_ASSESSMENT_USER: 'parties.role.mainAssessmentUser',
  ROLE_HQ_USER: 'parties.role.hqUser',
  ROLE_ADMIN_USER: 'parties.role.adminUser',
  ROLE_SUPER_ADMIN: 'parties.role.superAdmin',
  ROLE_SUPER_ADMIN_USER: 'parties.role.superAdminUser',
  ROLE_DOCTOR_USER: 'parties.role.doctorUser',
  ROLE_REQUEST_REGISTERY_AGENT: 'parties.role.requestRegisteryAgent',
  ROLE_MAIN_REQUEST_REGISTERY_AGENT: 'parties.role.mainRequestRegisteryAgent',
  ROLE_BRANCH_USER: 'parties.role.branchUser',
  ROLE_CUSTOMER_USER: 'parties.role.customerUser',
  ROLE_TICKET_AGENT: 'parties.role.ticketAgent',
}

export const USER_ACCOUNT_STATUS_TRANSLATION_KEYS = {
  disabled: 'parties.status.disabled',
  enabled: 'parties.status.enabled',
} as const

export const partyRoleColors: Record<PartyRole, string> = {
  ROLE_PUBLIC_USER:
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  ROLE_MONITORING_USER:
    'bg-cyan-100/30 text-cyan-900 dark:text-cyan-200 border-cyan-200',
  ROLE_ASSESSMENT_USER:
    'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200',
  ROLE_MAIN_ASSESSMENT_USER:
    'bg-violet-100/30 text-violet-900 dark:text-violet-200 border-violet-200',
  ROLE_HQ_USER:
    'bg-fuchsia-100/30 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-200',
  ROLE_ADMIN_USER:
    'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200',
  ROLE_SUPER_ADMIN:
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  ROLE_SUPER_ADMIN_USER:
    'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  ROLE_DOCTOR_USER:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  ROLE_REQUEST_REGISTERY_AGENT:
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  ROLE_MAIN_REQUEST_REGISTERY_AGENT:
    'bg-cyan-100/30 text-cyan-900 dark:text-cyan-200 border-cyan-200',
  ROLE_BRANCH_USER:
    'bg-lime-100/30 text-lime-900 dark:text-lime-200 border-lime-200',
  ROLE_CUSTOMER_USER:
    'bg-sky-100/30 text-sky-900 dark:text-sky-200 border-sky-200',
  ROLE_TICKET_AGENT:
    'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
}

export const userAccountStatusClasses = {
  disabled: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
  enabled:
    'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
} as const

export const NATIONALITY_TYPE_TRANSLATION_KEYS = {
  FOREIGN: 'parties.nationality.foreign',
  IR: 'parties.nationality.ir',
} as const

export function getPartyRoleOptions(t: TFunction) {
  return partyRoleSchema.options.map((value) => ({
    label: t(PARTY_ROLE_TRANSLATION_KEYS[value] as never) as string,
    value,
  }))
}

export function getNationalityTypeOptions(t: TFunction) {
  return nationalityTypeSchema.options.map((value) => ({
    label: t(NATIONALITY_TYPE_TRANSLATION_KEYS[value] as never) as string,
    value,
  }))
}
