import { getApiClient } from '@iap/api-client'
import {
  insurancePoliciesRequestSchema,
  insurancePoliciesResponseSchema,
} from '@iap/api-types'

export const insurancePolicyService = {
  async getAll() {
    insurancePoliciesRequestSchema.parse({})
    const response = await getApiClient().get<unknown>('/my/iap/my-policies')
    return insurancePoliciesResponseSchema.parse(response.data)
  },
}
