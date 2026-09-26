import { getApiClient } from '@iap/api-client'
import { insurancePolicySchema } from '@iap/api-types'
import { z } from 'zod'

const insurancePoliciesSchema = z.array(insurancePolicySchema)

export async function getInsurancePolicies(signal?: AbortSignal) {
  const response = await getApiClient().get<unknown>('/my/iap/my-policies', {
    signal,
  })

  return insurancePoliciesSchema.parse(response.data)
}
