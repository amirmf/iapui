import { getApiClient } from '@iap/api-client'
import { type SubInsuredPerson, subInsuredPeopleSchema } from '@iap/api-types'

export async function getSubInsuredPeople(
  policyId: number,
  signal?: AbortSignal
): Promise<SubInsuredPerson[]> {
  const response = await getApiClient().get<unknown>(
    `/my/iap/sub-insured-people/${policyId}`,
    { signal }
  )

  return subInsuredPeopleSchema.parse(response.data)
}

export const subInsuredPersonService = {
  getAll: getSubInsuredPeople,
}
