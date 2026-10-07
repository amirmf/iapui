import {
  type AfterCalculationResultRequest,
  type AfterCalculationResultResponse,
  type AssessmentItem,
  type ExternalDoctor,
  type ExternalIllnessAmount,
  type ExternalIllnessFranchise,
  type GetPreAuthsRequest,
  type PagePreAuthInquiry,
  afterCalculationResultResponseSchema,
  assessmentItemSchema,
  externalDoctorSchema,
  externalIllnessAmountSchema,
  externalIllnessFranchiseSchema,
  getPreAuthsRequestSchema,
  pagePreAuthInquirySchema,
} from '@features/assessment-items/model/assessment-item-form-contract'
import { getApiClient } from '@iap/api-client'
import {
  type AssessmentItemsData,
  afterCalculationResultRequestSchema,
  assessmentItemIdRequestSchema,
  assessmentItemIdsRequestSchema,
  assessmentItemListSchema,
  assessmentItemSoftDeleteQuerySchema,
  assessmentItemWriteRequestSchema,
  externalDoctorLookupRequestSchema,
  externalFranchiseAmountRequestSchema,
  externalIllnessAmountRequestSchema,
} from '@iap/api-types'
import type { z } from 'zod'

export type { AssessmentItemsData } from '@iap/api-types'
type ExternalIllnessAmountPayload = z.infer<
  typeof externalIllnessAmountRequestSchema
>
type ExternalFranchiseAmountPayload = z.infer<
  typeof externalFranchiseAmountRequestSchema
>
type ExternalDoctorLookupPayload = z.infer<
  typeof externalDoctorLookupRequestSchema
>

export const assessmentItemService = {
  getById: async (id: string): Promise<AssessmentItem> => {
    assessmentItemIdRequestSchema.parse({ id })
    const response = await getApiClient().get(`/assessment-items/${id}`)
    return assessmentItemSchema.parse(response.data)
  },

  getByClaimRequestId: async (
    claimRequestId: string,
    options?: { signal?: AbortSignal }
  ): Promise<AssessmentItem[]> => {
    assessmentItemIdRequestSchema.parse({ id: claimRequestId })
    const response = await getApiClient().get(
      `/assessment-items/claim-request/${claimRequestId}`,
      { signal: options?.signal }
    )
    return assessmentItemListSchema.parse(response.data)
  },

  create: async (data: AssessmentItemsData): Promise<AssessmentItem> => {
    const response = await getApiClient().post(
      '/assessment-items',
      assessmentItemWriteRequestSchema.parse(data)
    )
    return assessmentItemSchema.parse(response.data)
  },

  update: async (
    id: string,
    data: Partial<AssessmentItem>
  ): Promise<AssessmentItem> => {
    const response = await getApiClient().put(
      `/assessment-items/${id}`,
      assessmentItemWriteRequestSchema.parse(Object.assign({ id }, data))
    )
    return assessmentItemSchema.parse(response.data)
  },

  patch: async (
    id: string,
    data: Partial<AssessmentItem>
  ): Promise<AssessmentItem> => {
    const response = await getApiClient().patch(
      `/assessment-items/${id}`,
      assessmentItemWriteRequestSchema.parse(Object.assign({ id }, data))
    )
    return assessmentItemSchema.parse(response.data)
  },

  delete: async (id: string): Promise<void> => {
    assessmentItemIdRequestSchema.parse({ id })
    await getApiClient().delete(`/assessment-items/${id}`)
  },

  softDelete: async (
    ids: string[],
    thruDate?: string
  ): Promise<AssessmentItem[]> => {
    const params = assessmentItemSoftDeleteQuerySchema.parse(
      thruDate ? { thruDate } : {}
    )
    const response = await getApiClient().put(
      `/assessment-items/soft-delete`,
      assessmentItemIdsRequestSchema.parse(ids),
      {
        params,
      }
    )
    return assessmentItemListSchema.parse(response.data)
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    await getApiClient().delete(`/assessment-items/bulk-delete`, {
      data: assessmentItemIdsRequestSchema.parse(ids),
    })
  },

  fetchExternalIllnessAmount: async (
    payload: ExternalIllnessAmountPayload
  ): Promise<ExternalIllnessAmount> => {
    const response = await getApiClient().get('/external-illness-amounts', {
      params: externalIllnessAmountRequestSchema.parse(payload),
    })
    return externalIllnessAmountSchema.parse(response.data)
  },

  fetchExternalFranchiseAmount: async (
    payload: ExternalFranchiseAmountPayload
  ): Promise<ExternalIllnessFranchise> => {
    const response = await getApiClient().get('/external-franchise-amounts', {
      params: externalFranchiseAmountRequestSchema.parse(payload),
    })
    return externalIllnessFranchiseSchema.parse(response.data)
  },

  fetchExternalDoctorInfo: async (
    payload: ExternalDoctorLookupPayload
  ): Promise<ExternalDoctor> => {
    const response = await getApiClient().get('/external-doctors', {
      params: externalDoctorLookupRequestSchema.parse(payload),
    })
    return externalDoctorSchema.parse(response.data)
  },

  getAfterCalculationResult: async (
    payload: AfterCalculationResultRequest
  ): Promise<AfterCalculationResultResponse> => {
    const response = await getApiClient().post(
      '/claim-requests/get-after-calculation-result',
      afterCalculationResultRequestSchema.parse(payload)
    )
    return afterCalculationResultResponseSchema.parse(response.data)
  },

  getPreAuths: async (
    request: GetPreAuthsRequest,
    signal?: AbortSignal
  ): Promise<PagePreAuthInquiry> => {
    const params = getPreAuthsRequestSchema.parse(request)
    const response = await getApiClient().get(
      '/claim-requests/pre-auths/page-full',
      {
        params,
        signal,
      }
    )

    return pagePreAuthInquirySchema.parse(response.data)
  },
}

export default assessmentItemService
