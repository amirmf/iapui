import { getApiClient } from '@iap/api-client'
import {
  type AfterCalculationResultRequest,
  type FindAssessmentItemsByClaimRequestRequest,
  afterCalculationResultRequestSchema,
  afterCalculationResultResponseSchema,
  assessmentItemListSchema,
  findAssessmentItemsByClaimRequestRequestSchema,
} from '@iap/api-types'

export const assessmentItemService = {
  getAfterCalculationResult: async (payload: AfterCalculationResultRequest) => {
    const request = afterCalculationResultRequestSchema.parse(payload)
    const response = await getApiClient().post(
      '/claim-requests/get-after-calculation-result',
      request
    )
    return afterCalculationResultResponseSchema.parse(response.data)
  },
  findByClaimRequest: async (
    input: FindAssessmentItemsByClaimRequestRequest & { signal?: AbortSignal }
  ) => {
    const { signal, ...requestInput } = input
    const request =
      findAssessmentItemsByClaimRequestRequestSchema.parse(requestInput)
    const response = await getApiClient().get(
      `/assessment-items/claim-request/${request.path.claimRequestId}`,
      { signal }
    )

    return assessmentItemListSchema.parse(response.data)
  },
}
