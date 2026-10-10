import { getApiClient } from '@iap/api-client'
import { type InsurancePolicy, insurancePolicySchema } from '@iap/api-types'
import { z } from 'zod'

const insurancePoliciesSchema = z.array(insurancePolicySchema)

export async function getInsurancePolicies(
  signal?: AbortSignal
): Promise<InsurancePolicy[]> {
  const response = await getApiClient().get<unknown>('/my/iap/my-policies', {
    signal,
  })

  return insurancePoliciesSchema.parse(response.data)
}

export const insurancePolicyService = {
  getAll: getInsurancePolicies,
}
