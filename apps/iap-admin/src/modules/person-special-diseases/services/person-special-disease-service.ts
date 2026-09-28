import { getApiClient } from '@iap/api-client'
import {
  type PersonSpecialDisease,
  bulkDeletePersonSpecialDiseasesRequestSchema,
  createPersonSpecialDiseaseRequestSchema,
  deletePersonSpecialDiseaseRequestSchema,
  getInsuredPersonsByUserAccountIdRequestSchema,
  getPersonSpecialDiseaseByNationalCodeRequestSchema,
  getPersonSpecialDiseaseRequestSchema,
  insuredPersonListSchema,
  pagePersonSpecialDiseaseSchema,
  personSpecialDiseasePageRequestSchema,
  personSpecialDiseaseSchema,
  softDeletePersonSpecialDiseasesRequestSchema,
  updatePersonSpecialDiseaseRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

export const personSpecialDiseaseService = {
  async bulkDelete(ids: string[]) {
    const request = bulkDeletePersonSpecialDiseasesRequestSchema.parse(ids)
    await getApiClient().delete('/person-special-diseases/bulk-delete', {
      data: request,
    })
  },
  async create(input: PersonSpecialDisease) {
    const request = createPersonSpecialDiseaseRequestSchema.parse(input)
    const response = await getApiClient().post(
      '/person-special-diseases',
      request
    )
    return personSpecialDiseaseSchema.parse(response.data)
  },
  async getByNationalCode(nationalCode: string, signal?: AbortSignal) {
    const request = getPersonSpecialDiseaseByNationalCodeRequestSchema.parse({
      query: { nationalCode },
    })
    const response = await getApiClient().get(
      '/person-special-diseases/by-national-code',
      { params: request.query, signal }
    )
    return personSpecialDiseaseSchema.parse(response.data)
  },
  async getById(id: string, signal?: AbortSignal) {
    const request = getPersonSpecialDiseaseRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/person-special-diseases/${request.path.id}`,
      { signal }
    )
    return personSpecialDiseaseSchema.parse(response.data)
  },
  async getInsuredPersonsByUserAccountId(
    userAccountId: string,
    signal?: AbortSignal
  ) {
    const request = getInsuredPersonsByUserAccountIdRequestSchema.parse({
      path: { userAccountId },
    })
    const response = await getApiClient().get(
      `/core-connector/snapshots/${request.path.userAccountId}/sub-insured-people/insured-persons`,
      { signal }
    )

    return insuredPersonListSchema.parse(response.data)
  },
  async getPage(input: {
    direction?: string
    filters: Record<string, string | number | string[] | null | undefined>
    page?: number
    signal?: AbortSignal
    size?: number
    sort?: string
  }) {
    const { signal, ...requestInput } = input
    const request = personSpecialDiseasePageRequestSchema.parse(requestInput)
    const response = await getApiClient().get('/person-special-diseases/page', {
      params: {
        direction: request.direction,
        page: request.page,
        size: request.size,
        sort: request.sort,
        ...transformApiFilterParams(request.filters),
      },
      signal,
    })
    return pagePersonSpecialDiseaseSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deletePersonSpecialDiseaseRequestSchema.parse({
      path: { id },
    })
    await getApiClient().delete(`/person-special-diseases/${request.path.id}`)
  },
  async softDelete(ids: string[], thruDate?: string) {
    const request = softDeletePersonSpecialDiseasesRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/person-special-diseases/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : undefined,
      }
    )
    return personSpecialDiseaseSchema.array().parse(response.data)
  },
  async update(id: string, input: PersonSpecialDisease) {
    const request = updatePersonSpecialDiseaseRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().patch(
      `/person-special-diseases/${request.path.id}`,
      request.body
    )
    return personSpecialDiseaseSchema.parse(response.data)
  },
}
