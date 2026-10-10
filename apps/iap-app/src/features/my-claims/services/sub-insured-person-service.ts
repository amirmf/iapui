import { getApiClient } from '@iap/api-client'
import {
  subInsuredPeopleRequestSchema,
  subInsuredPeopleResponseSchema,
} from '@iap/api-types'

export const subInsuredPersonService = {
  async getAll(policyId: number) {
    const request = subInsuredPeopleRequestSchema.parse({ policyId })
    const response = await getApiClient().get<unknown>(
      `/my/iap/sub-insured-people/${request.policyId}`
    )
    return subInsuredPeopleResponseSchema.parse(response.data)
  },
}
