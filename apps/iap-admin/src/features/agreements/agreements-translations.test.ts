import fa from '@shared/i18n/locales/fa/common.json'
import { describe, expect, it } from 'vitest'

import referenceTranslations from './services/reference-translations.fixture.json'

const mountedTranslationKeys = [
  'agreements.title',
  'agreements.create',
  'agreements.refresh',
  'agreements.noAgreements',
  'agreements.columns.extContractId',
  'agreements.columns.extPolicyId',
  'agreements.columns.extLocation',
  'agreements.columns.extPlanId',
  'agreements.columns.fromDate',
  'agreements.columns.overrideRatio',
  'agreements.columns.status',
  'agreements.columns.templateCode',
  'agreements.columns.thruDate',
  'agreements.columns.title',
  'agreements.status.active',
  'agreements.status.draft',
  'agreements.status.expired',
  'agreements.status.inactive',
  'agreements.status.terminated',
  'agreements.filters.thruDateFrom',
  'agreements.filters.thruDateTo',
  'agreements.dialog.create',
  'agreements.dialog.createDesc',
  'agreements.dialog.edit',
  'agreements.dialog.editDesc',
  'agreements.dialog.details',
  'agreements.dialog.fields.code',
  'agreements.dialog.fields.extContractId',
  'agreements.dialog.fields.extLocation',
  'agreements.dialog.fields.extPlanId',
  'agreements.dialog.fields.extPolicyId',
  'agreements.dialog.fields.fromDate',
  'agreements.dialog.fields.overrideRatio',
  'agreements.dialog.fields.status',
  'agreements.dialog.fields.templateCode',
  'agreements.dialog.fields.thruDate',
  'agreements.dialog.fields.title',
  'agreements.actions.edit',
  'agreements.actions.initializeCoverageAppls',
  'agreements.initializeCoverageApplsDesc',
  'agreements.messages.coverageInitialized',
  'agreements.messages.created',
  'agreements.messages.updated',
  'agreements.partyAppls.add',
  'agreements.partyAppls.agreementTitle',
  'agreements.partyAppls.contactIdLabel',
  'agreements.partyAppls.policyIdLabel',
  'agreements.partyAppls.docTypes',
  'agreements.partyAppls.fromDate',
  'agreements.partyAppls.relationshipType',
  'agreements.partyAppls.role',
  'agreements.partyAppls.selectUser',
  'agreements.partyAppls.thruDate',
  'agreements.partyAppls.title',
  'agreements.partyAppls.user',
  'agreements.partyAppls.filters.agreementTitle',
  'agreements.partyAppls.filters.displayName',
  'agreements.partyAppls.filters.extContractId',
  'agreements.partyAppls.filters.extLocation',
  'agreements.partyAppls.filters.extPolicyId',
  'agreements.partyAppls.filters.username',
  'agreements.partyAppls.roles.owner',
  'agreements.partyAppls.roles.assessmentUser',
  'agreements.partyAppls.roles.mainAssessmentUser',
  'agreements.partyAppls.roles.hqUser',
  'agreements.partyAppls.roles.doctorUser',
  'agreements.partyAppls.roles.requestRegisteryAgent',
  'agreements.partyAppls.roles.mainRequestRegisteryAgent',
  'agreements.partyAppls.roles.branchUser',
  'agreements.partyAppls.roles.customerUser',
  'agreements.partyAppls.bulkCreate.agreementTitle',
  'agreements.partyAppls.bulkCreate.bulkCreateTitleBtn',
  'agreements.partyAppls.bulkCreate.description',
  'agreements.partyAppls.bulkCreate.displayName',
  'agreements.partyAppls.bulkCreate.extContractId',
  'agreements.partyAppls.bulkCreate.noResults',
  'agreements.partyAppls.bulkCreate.selectedAgreements',
  'agreements.partyAppls.bulkCreate.success',
  'agreements.partyAppls.bulkCreate.title',
  'agreements.partyAppls.bulkCreate.user',
  'agreements.partyAppls.bulkCreate.username',
  'agreementPartyAppls.bulkAssign.description',
  'agreementPartyAppls.bulkAssign.submit',
  'agreementPartyAppls.bulkAssign.success',
  'agreementPartyAppls.bulkAssign.title',
  'agreementPartyAppls.delete.descriptionWithAgreementAndRole',
  'agreementCoverageAppls.title',
  'agreementCoverageAppls.description',
  'agreementCoverageAppls.create',
  'agreementCoverageAppls.refresh',
  'agreementCoverageAppls.actions.edit',
  'agreementCoverageAppls.actions.inlineEdit',
  'agreementCoverageAppls.actions.view',
  'agreementCoverageAppls.dialog.create',
  'agreementCoverageAppls.dialog.createDesc',
  'agreementCoverageAppls.dialog.edit',
  'agreementCoverageAppls.dialog.editDesc',
  'agreementCoverageAppls.view.title',
  'agreementCoverageAppls.view.description',
  'agreementCoverageAppls.messages.updated',
  'agreementCoverageAppls.columns.agreementCode',
  'agreementCoverageAppls.columns.agreementTitle',
  'agreementCoverageAppls.columns.coverageGroupTitle',
  'agreementCoverageAppls.columns.coverageTitle',
  'agreementCoverageAppls.columns.damageCode',
  'agreementCoverageAppls.columns.damageTitle',
  'agreementCoverageAppls.columns.extPolicyId',
  'agreementCoverageAppls.columns.overrideRatio',
  'agreementCoverageAppls.columns.franchisePercentage',
  'agreementCoverageAppls.columns.coverageAmount',
  'agreementCoverageAppls.columns.amountPerCase',
  'agreementCoverageAppls.columns.fromDate',
  'agreementCoverageAppls.columns.thruDate',
  'agreementCoverageAppls.form.agreement',
  'agreementCoverageAppls.form.amountPerCase',
  'agreementCoverageAppls.form.coverageAmount',
  'agreementCoverageAppls.form.coverageDetail',
  'agreementCoverageAppls.form.damageCode',
  'agreementCoverageAppls.form.franchisePercentage',
  'agreementCoverageAppls.form.fromDate',
  'agreementCoverageAppls.form.overrideRatio',
  'agreementCoverageAppls.form.selectAgreement',
  'agreementCoverageAppls.form.selectCoverageDetail',
  'agreementCoverageAppls.form.selectDamageCode',
  'agreementCoverageAppls.form.thruDate',
  'common.cancel',
  'common.close',
  'common.create',
  'common.delete',
  'common.dialog.deleteDialog.permanentTitle',
  'common.noRecords',
  'common.noResults',
  'common.refresh',
  'common.update',
  'common.save',
  'common.saveChanges',
  'common.select',
  'form.submit',
  'form.update',
  'form.updating',
] as const

function getTranslation(key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (value, segment) =>
        typeof value === 'object' && value !== null
          ? (value as Record<string, unknown>)[segment]
          : undefined,
      fa
    )
}

describe('Agreements Persian translations', () => {
  it('matches every recorded reference Persian value exactly', () => {
    for (const [key, value] of Object.entries(referenceTranslations)) {
      expect(getTranslation(key), key).toBe(value)
    }
  })
  it('preserves reference missing-key behavior instead of inventing Persian values', () => {
    expect(
      getTranslation('agreementCoverageAppls.form.coverageGroup')
    ).toBeUndefined()
    expect(
      getTranslation('agreementCoverageAppls.form.selectCoverageGroup')
    ).toBeUndefined()
    expect(
      getTranslation('agreementCoverageAppls.messages.created')
    ).toBeUndefined()
  })
  it('defines every key used by the mounted Agreements page closure', () => {
    for (const key of mountedTranslationKeys) {
      expect(getTranslation(key), key).toEqual(expect.any(String))
    }
  })

  it('preserves the exact reference values added for the Agreements closure', () => {
    expect(getTranslation('common.create')).toBe('ثبت')
    expect(getTranslation('common.saveChanges')).toBe('ذخیره تغییرات')
    expect(getTranslation('common.select')).toBe('انتخاب کنید')
    expect(getTranslation('agreements.partyAppls.roles.owner')).toBe('مالک')
    expect(getTranslation('agreements.partyAppls.roles.customerUser')).toBe(
      'بیمه‌گذار'
    )
  })
})
