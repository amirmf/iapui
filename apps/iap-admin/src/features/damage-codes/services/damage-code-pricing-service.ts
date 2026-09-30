import { getApiClient } from '@iap/api-client'
import {
  type DamageCodePricing,
  type DamageCodePricingForm,
  bulkDeleteDamageCodePricingsRequestSchema,
  createDamageCodePricingRequestSchema,
  damageCodePricingPageRequestSchema,
  damageCodePricingPageSchema,
  damageCodePricingSchema,
  deleteDamageCodePricingRequestSchema,
  softDeleteDamageCodePricingsRequestSchema,
  updateDamageCodePricingRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function serializePricing(input: DamageCodePricingForm) {
  return {
    ...input,
    fromDate: input.fromDate?.toISOString(),
    thruDate: input.thruDate?.toISOString(),
  }
}

export const damageCodePricingService = {
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/damage-code-pricings/bulk-delete', {
      data: bulkDeleteDamageCodePricingsRequestSchema.parse(ids),
    })
  },
  async create(input: DamageCodePricingForm) {
    const request = createDamageCodePricingRequestSchema.parse(
      serializePricing(input)
    )
    const response = await getApiClient().post('/damage-code-pricings', request)
    return damageCodePricingSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteDamageCodePricingRequestSchema.parse({ path: { id } })
    await getApiClient().delete(`/damage-code-pricings/${request.path.id}`)
  },
  async getByDamageCodeId(
    damageCodeId: string,
    input: { page?: number; signal?: AbortSignal; size?: number } = {}
  ): Promise<DamageCodePricing[]> {
    const response = await getApiClient().get('/damage-code-pricings/page', {
      params: {
        damageCodeId,
        page: input.page ?? 0,
        size: input.size ?? 20,
      },
      signal: input.signal,
    })
    return damageCodePricingSchema.array().parse(response.data?.content ?? [])
  },
  async getById(id: string, signal?: AbortSignal) {
    const request = deleteDamageCodePricingRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/damage-code-pricings/${request.path.id}`,
      { signal }
    )
    return damageCodePricingSchema.parse(response.data)
  },
  async getPage(input: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = damageCodePricingPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get(
      '/damage-code-pricings/page-full',
      {
        params: {
          ...transformApiFilterParams(request.filters),
          page: request.page,
          size: request.size,
        },
        signal: input.signal,
      }
    )
    return damageCodePricingPageSchema.parse(response.data)
  },
  async softDelete(id: string, thruDate?: Date | string) {
    const serializedThruDate =
      thruDate instanceof Date ? thruDate.toISOString() : thruDate
    const request = deleteDamageCodePricingRequestSchema.parse({ path: { id } })
    const response = await getApiClient().put(
      `/damage-code-pricings/soft-delete/${request.path.id}`,
      null,
      { params: serializedThruDate ? { thruDate: serializedThruDate } : {} }
    )
    return damageCodePricingSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: Date | string) {
    const serializedThruDate =
      thruDate instanceof Date ? thruDate.toISOString() : thruDate
    const request = softDeleteDamageCodePricingsRequestSchema.parse({
      body: ids,
      query: { thruDate: serializedThruDate },
    })
    const response = await getApiClient().put(
      '/damage-code-pricings/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : {},
      }
    )
    return damageCodePricingSchema.array().parse(response.data)
  },
  async update(id: string, input: DamageCodePricingForm) {
    const request = updateDamageCodePricingRequestSchema.parse({
      body: { ...serializePricing(input), id },
      path: { id },
    })
    const response = await getApiClient().patch(
      `/damage-code-pricings/${request.path.id}`,
      request.body
    )
    return damageCodePricingSchema.parse(response.data)
  },
}
