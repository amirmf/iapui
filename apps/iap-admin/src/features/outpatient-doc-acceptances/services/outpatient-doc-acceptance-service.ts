import { getApiClient } from '@iap/api-client'
import {
  type DmgCase,
  type DmgCaseForm,
  type Issuance,
  type IssuanceForm,
  type OutpatientClaim,
  type OutpatientClaimForm,
  type OutpatientDocAcceptance,
  type OutpatientDocAcceptanceAdjustmentGenerationForm,
  type OutpatientDocAcceptanceForm,
  type OutpatientDocAcceptanceGenerationForm,
  type OutpatientDocAcceptancePageRequest,
  type OutpatientDocAcceptanceSubmissionForm,
  type PageOutpatientDocAcceptance,
  dmgCaseFormSchema,
  dmgCaseMutationRequestSchema,
  dmgCaseSchema,
  issuanceFormSchema,
  issuanceMutationRequestSchema,
  issuanceSchema,
  outpatientClaimFormSchema,
  outpatientClaimMutationRequestSchema,
  outpatientClaimSchema,
  outpatientDocAcceptanceAdjustmentGenerationFormSchema,
  outpatientDocAcceptanceFormSchema,
  outpatientDocAcceptanceGenerationFormSchema,
  outpatientDocAcceptanceMutationRequestSchema,
  outpatientDocAcceptancePageRequestSchema,
  outpatientDocAcceptanceSchema,
  outpatientDocAcceptanceSubmissionFormSchema,
  pageOutpatientDocAcceptanceSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

const apiClient = () => getApiClient()

const toNumber = (value: string | undefined) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const toString = (value: string | undefined) => {
  if (!value) {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

const toBoolean = (value: boolean | undefined) => {
  if (typeof value === 'boolean') {
    return value
  }
  return undefined
}

const cleanPayload = <T extends Record<string, unknown>>(payload: T): T => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as T
}

const mapGenerationForm = (form: OutpatientDocAcceptanceGenerationForm) => ({
  claimRequestId: form.claimRequestId,
  date: form.date.toISOString(),
})

const mapSubmissionForm = (form: OutpatientDocAcceptanceSubmissionForm) => ({
  outpatientDocAcceptanceId: form.outpatientDocAcceptanceId,
  // date: form.date.toISOString(),
})

const mapDocAcceptanceForm = (form: OutpatientDocAcceptanceForm) =>
  cleanPayload({
    exId: toNumber(form.exId),
    docDeliveryKindId: toNumber(form.docDeliveryKindId),
    deliveryDate: toString(form.deliveryDate),
    acceptanceKindId: toNumber(form.acceptanceKindId),
    claimCount: toNumber(form.claimCount),
    dichargeMonth: toNumber(form.dichargeMonth),
    totalAmount: toNumber(form.totalAmount),
    policyId: toNumber(form.policyId),
    insuredPersonId: toNumber(form.insuredPersonId),
    medicalCenterId: toNumber(form.medicalCenterId),
    letterDate: toString(form.letterDate),
    letterNo: toString(form.letterNo),
    secretariatNo: toString(form.secretariatNo),
    secretariatDate: toString(form.secretariatDate),
    paymentDate: toString(form.paymentDate),
    docDelivererAgentId: toNumber(form.docDelivererAgentId),
    dataSenderId: toNumber(form.dataSenderId),
    claimExpertId: toNumber(form.claimExpertId),
    opUnitId: toNumber(form.opUnitId),
    exStatus: toNumber(form.exStatus),
    status: form.status ?? undefined,
    claimRequestId: toString(form.claimRequestId),
    wsResult: toString(form.wsResult),
    wsStatus: form.wsStatus ?? undefined,
  })

const mapClaimForm = (form: OutpatientClaimForm, docAcceptanceId?: string) =>
  cleanPayload({
    acceptanceId: toNumber(form.acceptanceId) ?? toNumber(docAcceptanceId),
    announcementDate: toString(form.announcementDate),
    chargePlanId: toNumber(form.chargePlanId),
    claimExpertId: toNumber(form.claimExpertId),
    dataSenderId: toNumber(form.dataSenderId),
    description: toString(form.description),
    dmgRegisterarId: toNumber(form.dmgRegisterarId),
    docDelivererAgentId: toNumber(form.docDelivererAgentId),
    docDeliveryKindId: toNumber(form.docDeliveryKindId),
    draftExpertId: toNumber(form.draftExpertId),
    estimateAmount: toNumber(form.estimateAmount),
    expertiseEndDate: toString(form.expertiseEndDate),
    hasPreAuth: toBoolean(form.hasPreAuth),
    hasReturnDocs: toBoolean(form.hasReturnDocs),
    exId: toNumber(form.exId),
    claimNo: toNumber(form.claimNo),
    insuredPersonId: toNumber(form.insuredPersonId),
    isMatchedWithList: toBoolean(form.isMatchedWithList),
    isPaymentFromCash: toBoolean(form.isPaymentFromCash),
    letterNo: toString(form.letterNo),
    medicalCenterId: toNumber(form.medicalCenterId),
    policyId: toNumber(form.policyId),
    statusChangeDate: toString(form.statusChangeDate),
    exStatus: toNumber(form.exStatus),
    status: form.status ?? undefined,
    claimRequestId: toString(form.claimRequestId),
    wsResult: toString(form.wsResult),
    wsStatus: form.wsStatus ?? undefined,
  })

const mapIssuanceForm = (form: IssuanceForm, docAcceptanceId?: string) =>
  cleanPayload({
    draftKindId: toNumber(form.draftKindId),
    description: toString(form.description),
    certificationExpertId: toNumber(form.certificationExpertId),
    complementReasonId: toNumber(form.complementReasonId),
    dataSenderId: toNumber(form.dataSenderId),
    amount: toNumber(form.amount),
    autoCalc: toBoolean(form.autoCalc),
    claimId: toNumber(form.claimId),
    docAcceptanceId:
      toNumber(form.docAcceptanceId) ?? toNumber(docAcceptanceId),
    draftNo: toString(form.draftNo),
    draftReasonId: toNumber(form.draftReasonId),
    reasonId: toNumber(form.reasonId),
    exId: toNumber(form.exId),
    isComfort: toBoolean(form.isComfort),
    issuDate: toString(form.issuDate),
    sourceId: toNumber(form.sourceId),
    exStatus: toNumber(form.exStatus),
    calcTime: toString(form.calcTime),
    changeTime: toString(form.changeTime),
    paymentPreparationTime: toString(form.paymentPreparationTime),
    calcJobStatus: toNumber(form.calcJobStatus),
    status: form.status ?? undefined,
    claimRequestId: toString(form.claimRequestId),
    wsResult: toString(form.wsResult),
    wsStatus: form.wsStatus ?? undefined,
  })

const mapDmgCaseForm = (form: DmgCaseForm, docAcceptanceId?: string) =>
  cleanPayload({
    insuredPersonId: toNumber(form.insuredPersonId),
    serviceDate: toString(form.serviceDate),
    medicalSystemCode: toNumber(form.medicalSystemCode),
    illnessId: toNumber(form.illnessId),
    serviceDetailId: toNumber(form.serviceDetailId),
    serviceProvinceId: toNumber(form.serviceProvinceId),
    tariffKindId: toNumber(form.tariffKindId),
    doctorSpecialityId: toNumber(form.doctorSpecialityId),
    isFranchiseDeduction: toBoolean(form.isFranchiseDeduction),
    excessFranchiseAmount: toNumber(form.excessFranchiseAmount),
    deductionKindId: toNumber(form.deductionKindId),
    deductionAmount: toNumber(form.deductionAmount),
    firstInsurerShareAmount: toNumber(form.firstInsurerShareAmount),
    expertiseFranchisePercent: toNumber(form.expertiseFranchisePercent),
    otherOrganizationsShareAmount: toNumber(form.otherOrganizationsShareAmount),
    toothId: toNumber(form.toothId),
    insuredIsAdult: toBoolean(form.insuredIsAdult),
    medicalCenterId: toNumber(form.medicalCenterId),
    drugCount: toNumber(form.drugCount),
    deliveredDocTypeId: toNumber(form.deliveredDocTypeId),
    preAuthId: toNumber(form.preAuthId),
    medicalBookLetSerialNo: toNumber(form.medicalBookLetSerialNo),
    medicalBookletPageNo: toNumber(form.medicalBookletPageNo),
    cardSerial: toString(form.cardSerial),
    deductionDesc: toString(form.deductionDesc),
    discountAmount: toNumber(form.discountAmount),
    excessOfTheInsurersCommitmentAmount: toNumber(
      form.excessOfTheInsurersCommitmentAmount
    ),
    outOfTheInsurersCommitmentAmount: toNumber(
      form.outOfTheInsurersCommitmentAmount
    ),
    thePatientLedFranchise: toNumber(form.thePatientLedFranchise),
    otherRecoverableAmount: toNumber(form.otherRecoverableAmount),
    requestedAmount: toNumber(form.requestedAmount),
    approvedAmount: toNumber(form.approvedAmount),
    drugClaimId: toNumber(form.drugClaimId),
    systemCalculated: toBoolean(form.systemCalculated),
    dataSenderId: toNumber(form.dataSenderId),
    claimId: toNumber(form.claimId),
    draftId: toNumber(form.draftId),
    firstInsurerId: toNumber(form.firstInsurerId),
    franchise: toNumber(form.franchise),
    exId: toNumber(form.exId),
    nonPaymentReason: toString(form.nonPaymentReason),
    totalAmount: toNumber(form.totalAmount),
    isCalculated: toBoolean(form.isCalculated),
    status: form.status ?? undefined,
    claimRequestId: toString(form.claimRequestId),
    assessmentItemId: toString(form.assessmentItemId),
    wsResult: toString(form.wsResult),
    wsStatus: form.wsStatus ?? undefined,
    docAcceptanceId: toNumber(docAcceptanceId),
  })

export const outpatientDocAcceptanceService = {
  async getPage(
    params: OutpatientDocAcceptancePageRequest & { signal?: AbortSignal } = {}
  ): Promise<PageOutpatientDocAcceptance> {
    const { signal, ...input } = params
    const { page, size, sort, direction, filters } =
      outpatientDocAcceptancePageRequestSchema.parse(input)

    const response = await apiClient().get('/outpatient-doc-acceptances/page', {
      params: {
        page,
        size,
        sort,
        direction,
        ...transformApiFilterParams(filters),
      },
      signal,
    })
    return pageOutpatientDocAcceptanceSchema.parse(response.data)
  },

  async getById(
    id: string,
    options?: { signal?: AbortSignal }
  ): Promise<OutpatientDocAcceptance> {
    const response = await apiClient().get(
      `/outpatient-doc-acceptances/${id}`,
      {
        signal: options?.signal,
      }
    )
    return outpatientDocAcceptanceSchema.parse(response.data)
  },

  async exportReport(params: {
    outpatientDocAcceptanceId: string
    signal?: AbortSignal
  }): Promise<Blob> {
    const { outpatientDocAcceptanceId, signal } = params
    const response = await apiClient().get(
      '/outpatient-doc-acceptances/export-report',
      {
        params: { outpatientDocAcceptanceId },
        responseType: 'blob',
        signal,
      }
    )
    return response.data
  },

  async exportPdfReport(params: {
    outpatientDocAcceptanceId: string
    signal?: AbortSignal
  }): Promise<Blob> {
    const { outpatientDocAcceptanceId, signal } = params
    const response = await apiClient().get(
      '/outpatient-doc-acceptances/export-report/pdf',
      {
        params: { outpatientDocAcceptanceId },
        responseType: 'blob',
        signal,
      }
    )
    return response.data
  },

  async create(
    form: OutpatientDocAcceptanceForm
  ): Promise<OutpatientDocAcceptance> {
    const payload = outpatientDocAcceptanceFormSchema.parse(form)
    const response = await apiClient().post(
      '/outpatient-doc-acceptances',
      outpatientDocAcceptanceMutationRequestSchema.parse(
        mapDocAcceptanceForm(payload)
      )
    )
    return outpatientDocAcceptanceSchema.parse(response.data)
  },

  async update(
    id: string,
    form: OutpatientDocAcceptanceForm
  ): Promise<OutpatientDocAcceptance> {
    const payload = outpatientDocAcceptanceFormSchema.parse(form)
    const response = await apiClient().patch(
      `/outpatient-doc-acceptances/${id}`,
      {
        id,
        ...outpatientDocAcceptanceMutationRequestSchema.parse(
          mapDocAcceptanceForm(payload)
        ),
      }
    )
    return outpatientDocAcceptanceSchema.parse(response.data)
  },

  async generate(
    form: OutpatientDocAcceptanceGenerationForm
  ): Promise<OutpatientDocAcceptance[]> {
    const payload = outpatientDocAcceptanceGenerationFormSchema.parse(form)
    const response = await apiClient().post(
      '/outpatient-doc-acceptances/generate',
      {
        ...mapGenerationForm(payload),
      }
    )
    return response.data.map((item: unknown) =>
      outpatientDocAcceptanceSchema.parse(item)
    )
  },

  async generateAdjustment(
    form: OutpatientDocAcceptanceAdjustmentGenerationForm
  ): Promise<OutpatientDocAcceptance[]> {
    const payload =
      outpatientDocAcceptanceAdjustmentGenerationFormSchema.parse(form)
    const response = await apiClient().post(
      '/outpatient-doc-acceptances/adjustment/generate',
      payload
    )
    return response.data.map((item: unknown) =>
      outpatientDocAcceptanceSchema.parse(item)
    )
  },

  async send(
    form: OutpatientDocAcceptanceSubmissionForm
  ): Promise<OutpatientDocAcceptance[]> {
    const payload = outpatientDocAcceptanceSubmissionFormSchema.parse(form)
    const response = await apiClient().post(
      '/outpatient-doc-acceptances/send',
      {
        ...mapSubmissionForm(payload),
      }
    )
    return response.data.map((item: unknown) =>
      outpatientDocAcceptanceSchema.parse(item)
    )
  },

  async delete(id: string): Promise<void> {
    await apiClient().delete(`/outpatient-doc-acceptances/${id}`)
  },

  async getClaim(docAcceptanceId: string): Promise<OutpatientClaim | null> {
    try {
      const response = await apiClient().get(
        `/outpatient-claims/${docAcceptanceId}`
      )
      return outpatientClaimSchema.parse(response.data)
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response
          ?.status
        if (status === 404) {
          return null
        }
      }
      throw error
    }
  },

  async createClaim(
    docAcceptanceId: string,
    form: OutpatientClaimForm
  ): Promise<OutpatientClaim> {
    const payload = outpatientClaimFormSchema.parse(form)
    const response = await apiClient().post(
      `/outpatient-claims/${docAcceptanceId}`,
      {
        ...outpatientClaimMutationRequestSchema.parse(
          mapClaimForm(payload, docAcceptanceId)
        ),
      }
    )
    return outpatientClaimSchema.parse(response.data)
  },

  async updateClaim(
    docAcceptanceId: string,
    form: OutpatientClaimForm
  ): Promise<OutpatientClaim> {
    const payload = outpatientClaimFormSchema.parse(form)
    const response = await apiClient().put(
      `/outpatient-claims/${docAcceptanceId}`,
      {
        ...outpatientClaimMutationRequestSchema.parse(
          mapClaimForm(payload, docAcceptanceId)
        ),
      }
    )
    return outpatientClaimSchema.parse(response.data)
  },

  async deleteClaim(docAcceptanceId: string): Promise<void> {
    await apiClient().delete(`/outpatient-claims/${docAcceptanceId}`)
  },

  async syncInqueryStatuses(): Promise<number> {
    const response = await apiClient().post(
      '/outpatient-claims/sync-inquery-statuses'
    )
    return Number(response.data)
  },

  async getIssuance(docAcceptanceId: string): Promise<Issuance | null> {
    try {
      const response = await apiClient().get(`/issuances/${docAcceptanceId}`)
      return issuanceSchema.parse(response.data)
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response
          ?.status
        if (status === 404) {
          return null
        }
      }
      throw error
    }
  },

  async createIssuance(
    docAcceptanceId: string,
    form: IssuanceForm
  ): Promise<Issuance> {
    const payload = issuanceFormSchema.parse(form)
    const response = await apiClient().post(`/issuances/${docAcceptanceId}`, {
      ...issuanceMutationRequestSchema.parse(
        mapIssuanceForm(payload, docAcceptanceId)
      ),
    })
    return issuanceSchema.parse(response.data)
  },

  async updateIssuance(
    docAcceptanceId: string,
    form: IssuanceForm
  ): Promise<Issuance> {
    const payload = issuanceFormSchema.parse(form)
    const response = await apiClient().put(`/issuances/${docAcceptanceId}`, {
      ...issuanceMutationRequestSchema.parse(
        mapIssuanceForm(payload, docAcceptanceId)
      ),
    })
    return issuanceSchema.parse(response.data)
  },

  async deleteIssuance(docAcceptanceId: string): Promise<void> {
    await apiClient().delete(`/issuances/${docAcceptanceId}`)
  },

  async getDmgCases(docAcceptanceId: string): Promise<DmgCase[]> {
    const response = await apiClient().get(`/dmg-cases/${docAcceptanceId}`)
    return response.data.map((item: unknown) => dmgCaseSchema.parse(item))
  },

  async getDmgCaseById(
    docAcceptanceId: string,
    dmgCaseId: string
  ): Promise<DmgCase> {
    const response = await apiClient().get(
      `/dmg-cases/${docAcceptanceId}/${dmgCaseId}`
    )
    return dmgCaseSchema.parse(response.data)
  },

  async createDmgCase(
    docAcceptanceId: string,
    form: DmgCaseForm
  ): Promise<DmgCase> {
    const payload = dmgCaseFormSchema.parse(form)
    const response = await apiClient().post(`/dmg-cases/${docAcceptanceId}`, {
      ...dmgCaseMutationRequestSchema.parse(
        mapDmgCaseForm(payload, docAcceptanceId)
      ),
    })
    return dmgCaseSchema.parse(response.data)
  },

  async updateDmgCase(
    docAcceptanceId: string,
    dmgCaseId: string,
    form: DmgCaseForm
  ): Promise<DmgCase> {
    const payload = dmgCaseFormSchema.parse(form)
    const response = await apiClient().put(
      `/dmg-cases/${docAcceptanceId}/${dmgCaseId}`,
      {
        ...dmgCaseMutationRequestSchema.parse(
          mapDmgCaseForm(payload, docAcceptanceId)
        ),
      }
    )
    return dmgCaseSchema.parse(response.data)
  },

  async deleteDmgCase(
    docAcceptanceId: string,
    dmgCaseId: string
  ): Promise<void> {
    await apiClient().delete(`/dmg-cases/${docAcceptanceId}/${dmgCaseId}`)
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient().post(`/outpatient-doc-acceptances/cancel`, {
      outpatientDocAcceptanceId: id,
    })
  },

  terminate: async (id: string): Promise<void> => {
    await apiClient().post(`/outpatient-doc-acceptances/terminate`, {
      outpatientDocAcceptanceId: id,
    })
  },

  softDelete: async (
    ids: string[],
    thruDate?: string
  ): Promise<OutpatientDocAcceptance[]> => {
    const params = thruDate ? { thruDate } : {}
    const response = await apiClient().put(
      `/outpatient-doc-acceptances/soft-delete`,
      ids,
      {
        params,
      }
    )
    return response.data.map((item: unknown) =>
      outpatientDocAcceptanceSchema.parse(item)
    )
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    await apiClient().delete(`/outpatient-doc-acceptances/bulk-delete`, {
      data: ids,
    })
  },
}

export default outpatientDocAcceptanceService
