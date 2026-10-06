import { getApiClient } from '@iap/api-client'
import {
  type AgreementForm,
  agreementPageRequestSchema,
  agreementSchema,
  bulkDeleteAgreementsRequestSchema,
  createAgreementRequestSchema,
  getAgreementRequestSchema,
  pageAgreementFullSchema,
  pageAgreementSchema,
  softDeleteAgreementRequestSchema,
  softDeleteAgreementsRequestSchema,
  updateAgreementRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function serialize(input: AgreementForm) {
  const numeric = (value?: string) =>
    value == null || Number.isNaN(Number(value)) ? undefined : Number(value)
  return {
    ...input,
    templateCode: input.templateCode?.trim() || undefined,
    extLocation: input.extLocation?.trim() || undefined,
    extContractId: numeric(input.extContractId),
    extPlanId: numeric(input.extPlanId),
    extPolicyId: numeric(input.extPolicyId),
    overrideRatio: numeric(input.overrideRatio),
    fromDate: input.fromDate.toISOString(),
    thruDate: input.thruDate?.toISOString(),
  }
}
export const agreementService = {
  async getPage(input: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = agreementPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 30,
    })
    const response = await getApiClient().get('/agreements/page', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return pageAgreementSchema.parse(response.data)
  },
  async getPageFull(input: {
    filters?: Record<string, string | string[]>
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = agreementPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 30,
    })
    const response = await getApiClient().get('/agreements/page-full', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return pageAgreementFullSchema.parse(response.data)
  },
  async getById(id: string, options?: { signal?: AbortSignal }) {
    const request = getAgreementRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/agreements/${request.path.id}`,
      { signal: options?.signal }
    )
    return agreementSchema.parse(response.data)
  },
  async create(input: AgreementForm) {
    const request = createAgreementRequestSchema.parse(input)
    return agreementSchema.parse(
      (await getApiClient().post('/agreements', serialize(request))).data
    )
  },
  async update(id: string, input: AgreementForm) {
    const request = updateAgreementRequestSchema.parse({
      body: input,
      path: { id },
    })
    return agreementSchema.parse(
      (
        await getApiClient().put(`/agreements/${request.path.id}`, {
          ...serialize(request.body),
          id: request.path.id,
        })
      ).data
    )
  },
  async softDeleteBulk(ids: string[], thruDate?: string) {
    const request = softDeleteAgreementsRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    return agreementSchema.array().parse(
      (
        await getApiClient().put('/agreements/soft-delete', request.body, {
          params: request.query.thruDate
            ? { thruDate: request.query.thruDate }
            : {},
        })
      ).data
    )
  },
  async softDelete(id: string, thruDate?: string) {
    const request = softDeleteAgreementRequestSchema.parse({
      path: { id },
      query: { thruDate },
    })
    return agreementSchema.parse(
      (
        await getApiClient().put(
          `/agreements/soft-delete/${request.path.id}`,
          null,
          {
            params: request.query.thruDate
              ? { thruDate: request.query.thruDate }
              : {},
          }
        )
      ).data
    )
  },
  async delete(id: string) {
    const request = getAgreementRequestSchema.parse({ path: { id } })
    await getApiClient().delete(`/agreements/${request.path.id}`)
  },
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/agreements/bulk-delete', {
      data: bulkDeleteAgreementsRequestSchema.parse(ids),
    })
  },
}
