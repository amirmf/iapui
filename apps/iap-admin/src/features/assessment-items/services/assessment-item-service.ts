import { getApiClient } from '@iap/api-client'
import {
  type FindAssessmentItemsByClaimRequestRequest,
  assessmentItemListSchema,
  findAssessmentItemsByClaimRequestRequestSchema,
} from '@iap/api-types'

export const assessmentItemService = {
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
