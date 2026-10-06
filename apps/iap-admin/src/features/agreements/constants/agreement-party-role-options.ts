import type { AgreementPartyRole } from '@iap/api-types'
import type { TFunction } from 'i18next'

export const agreementPartyRoleTranslationKeys: Record<
  NonNullable<AgreementPartyRole>,
  `agreements.partyAppls.roles.${string}`
> = {
  OWNER: 'agreements.partyAppls.roles.owner',
  ASSESSMENT_USER: 'agreements.partyAppls.roles.assessmentUser',
  MAIN_ASSESSMENT_USER: 'agreements.partyAppls.roles.mainAssessmentUser',
  HQ_USER: 'agreements.partyAppls.roles.hqUser',
  DOCTOR_USER: 'agreements.partyAppls.roles.doctorUser',
  REQUEST_REGISTERY_AGENT: 'agreements.partyAppls.roles.requestRegisteryAgent',
  MAIN_REQUEST_REGISTERY_AGENT:
    'agreements.partyAppls.roles.mainRequestRegisteryAgent',
  BRANCH_USER: 'agreements.partyAppls.roles.branchUser',
  CUSTOMER_USER: 'agreements.partyAppls.roles.customerUser',
}

export const agreementPartyApplCreateRoles = [
  'OWNER',
  'ASSESSMENT_USER',
  'CUSTOMER_USER',
  'MAIN_ASSESSMENT_USER',
  'DOCTOR_USER',
  'REQUEST_REGISTERY_AGENT',
  'MAIN_REQUEST_REGISTERY_AGENT',
] as const satisfies readonly NonNullable<AgreementPartyRole>[]

export function getAgreementPartyApplCreateRoleOptions(t: TFunction) {
  return agreementPartyApplCreateRoles.map((value) => ({
    label: t(agreementPartyRoleTranslationKeys[value] as never) as string,
    value,
  }))
}

export const AGREEMENT_PARTY_ROLE_TRANSLATION_KEYS =
  agreementPartyRoleTranslationKeys

export function getAgreementPartyRoleOptions(t: TFunction) {
  return (
    Object.keys(
      agreementPartyRoleTranslationKeys
    ) as NonNullable<AgreementPartyRole>[]
  ).map((value) => ({
    label: t(agreementPartyRoleTranslationKeys[value] as never) as string,
    value,
  }))
}
