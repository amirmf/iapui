import { type TFunction } from 'i18next'

export const SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES = [
  'TEXT',
  'LIST',
  'NOINPUT',
] as const

export type SupportRequiredParamInputDisplayValue =
  (typeof SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES)[number]

export const SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_TRANSLATION_KEYS: Record<
  SupportRequiredParamInputDisplayValue,
  `supportQuestions.inputDisplay.${string}`
> = {
  TEXT: 'supportQuestions.inputDisplay.TEXT',
  LIST: 'supportQuestions.inputDisplay.LIST',
  NOINPUT: 'supportQuestions.inputDisplay.NOINPUT',
}

export const getSupportRequiredParamInputDisplayOptions = (
  t: TFunction
): Array<{ label: string; value: SupportRequiredParamInputDisplayValue }> => {
  return Object.entries(
    SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_TRANSLATION_KEYS
  ).map(([inputDisplay, translationKey]) => ({
    label: t(translationKey as never) as string,
    value: inputDisplay as SupportRequiredParamInputDisplayValue,
  }))
}

export const supportQuestionStatusColors: Record<
  'active' | 'inactive',
  string
> = {
  active: 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200',
  inactive: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
}

export const PARTY_ROLES = [
  'ROLE_PUBLIC_USER',
  'ROLE_MONITORING_USER',
  'ROLE_ASSESSMENT_USER',
  'ROLE_MAIN_ASSESSMENT_USER',
  'ROLE_HQ_USER',
  'ROLE_ADMIN_USER',
  'ROLE_SUPER_ADMIN',
  'ROLE_SUPER_ADMIN_USER',
  'ROLE_DOCTOR_USER',
  'ROLE_REQUEST_REGISTERY_AGENT',
  'ROLE_MAIN_REQUEST_REGISTERY_AGENT',
  'ROLE_BRANCH_USER',
  'ROLE_CUSTOMER_USER',
  'ROLE_TICKET_AGENT',
] as const

export type PartyRole = (typeof PARTY_ROLES)[number]

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

export const getPartyRoleOptions = (
  t: TFunction
): Array<{ label: string; value: PartyRole }> => {
  return PARTY_ROLES.map((role) => ({
    label: t(PARTY_ROLE_TRANSLATION_KEYS[role] as never) as string,
    value: role,
  }))
}
