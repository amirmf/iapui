import { getApiClient } from '@iap/api-client'
import {
  type DamageCodeForm,
  type DamageCodePricingPriceRequest,
  bulkDeleteDamageCodesRequestSchema,
  createDamageCodeRequestSchema,
  damageCodePageRequestSchema,
  damageCodePageSchema,
  damageCodePricingPriceRequestSchema,
  damageCodePricingPriceResponseSchema,
  damageCodeSchema,
  getDamageCodeRequestSchema,
  softDeleteDamageCodesRequestSchema,
  updateDamageCodeRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function serializeDamageCode(input: DamageCodeForm) {
  return {
    ...input,
    fromDate: input.fromDate?.toISOString(),
    thruDate: input.thruDate?.toISOString(),
  }
}

export const damageCodeService = {
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/damage-codes/bulk-delete', {
      data: bulkDeleteDamageCodesRequestSchema.parse(ids),
    })
  },
  async create(input: DamageCodeForm) {
    const request = createDamageCodeRequestSchema.parse(
      serializeDamageCode(input)
    )
    const response = await getApiClient().post('/damage-codes', request)
    return damageCodeSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = getDamageCodeRequestSchema.parse({ path: { id } })
    await getApiClient().delete(`/damage-codes/${request.path.id}`)
  },
  async getById(id: string, signal?: AbortSignal) {
    const request = getDamageCodeRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/damage-codes/${request.path.id}`,
      {
        signal,
      }
    )
    return damageCodeSchema.parse(response.data)
  },
  async getPage(input: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = damageCodePageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get('/damage-codes/page', {
      params: {
        ...transformApiFilterParams(request.filters),
        page: request.page,
        size: request.size,
      },
      signal: input.signal,
    })
    return damageCodePageSchema.parse(response.data)
  },
  async getPrice(
    input: DamageCodePricingPriceRequest & { signal?: AbortSignal }
  ) {
    const { signal, ...requestInput } = input
    const request = damageCodePricingPriceRequestSchema.parse(requestInput)
    const response = await getApiClient().get('/damage-code-pricings/price', {
      params: request,
      signal,
    })
    return damageCodePricingPriceResponseSchema.parse(response.data)
  },
  async softDelete(id: string, thruDate?: string) {
    const request = getDamageCodeRequestSchema.parse({ path: { id } })
    const response = await getApiClient().put(
      `/damage-codes/soft-delete/${request.path.id}`,
      null,
      { params: thruDate ? { thruDate } : {} }
    )
    return damageCodeSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: string) {
    const request = softDeleteDamageCodesRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/damage-codes/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : {},
      }
    )
    return damageCodeSchema.array().parse(response.data)
  },
  async update(id: string, input: DamageCodeForm) {
    const request = updateDamageCodeRequestSchema.parse({
      body: { ...serializeDamageCode(input), id },
      path: { id },
    })
    const response = await getApiClient().patch(
      `/damage-codes/${request.path.id}`,
      request.body
    )
    return damageCodeSchema.parse(response.data)
  },
}
