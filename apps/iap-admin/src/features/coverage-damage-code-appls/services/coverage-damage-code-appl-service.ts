import { getApiClient } from '@iap/api-client'
import {
  type CoverageDamageCodeApplForm,
  bulkDeleteCoverageDamageCodeApplsRequestSchema,
  coverageDamageCodeApplDamageCodePageSchema,
  coverageDamageCodeApplPageRequestSchema,
  coverageDamageCodeApplPageSchema,
  coverageDamageCodeApplSchema,
  createCoverageDamageCodeApplRequestSchema,
  deleteCoverageDamageCodeApplRequestSchema,
  softDeleteCoverageDamageCodeApplsRequestSchema,
  updateCoverageDamageCodeApplRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function serialize(input: CoverageDamageCodeApplForm) {
  return {
    ...input,
    fromDate: input.fromDate?.toISOString(),
    thruDate: input.thruDate?.toISOString(),
  }
}

function serializeThruDate(thruDate?: Date | string) {
  return thruDate instanceof Date ? thruDate.toISOString() : thruDate
}
export const coverageDamageCodeApplService = {
  async getPage(input: {
    direction?: 'ASC' | 'DESC'
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
    sort?: string
  }) {
    const request = coverageDamageCodeApplPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get(
      '/coverage-damage-code-appls/page-full',
      {
        params: {
          direction: input.direction,
          page: request.page,
          size: request.size,
          sort: input.sort,
          ...transformApiFilterParams(request.filters),
        },
        signal: input.signal,
      }
    )
    return coverageDamageCodeApplPageSchema.parse(response.data)
  },
  async create(input: CoverageDamageCodeApplForm) {
    const request = createCoverageDamageCodeApplRequestSchema.parse(input)
    const response = await getApiClient().post(
      '/coverage-damage-code-appls',
      serialize(request)
    )
    return coverageDamageCodeApplSchema.parse(response.data)
  },
  async update(id: string, input: CoverageDamageCodeApplForm) {
    const request = updateCoverageDamageCodeApplRequestSchema.parse({
      body: { ...input, id },
      path: { id },
    })
    const response = await getApiClient().patch(
      `/coverage-damage-code-appls/${request.path.id}`,
      serialize(request.body)
    )
    return coverageDamageCodeApplSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteCoverageDamageCodeApplRequestSchema.parse({
      path: { id },
    })
    await getApiClient().delete(
      `/coverage-damage-code-appls/${request.path.id}`
    )
  },
  async softDelete(id: string, thruDate?: Date | string) {
    const request = deleteCoverageDamageCodeApplRequestSchema.parse({
      path: { id },
    })
    const serializedThruDate = serializeThruDate(thruDate)
    const response = await getApiClient().put(
      `/coverage-damage-code-appls/soft-delete/${request.path.id}`,
      null,
      { params: serializedThruDate ? { thruDate: serializedThruDate } : {} }
    )
    return coverageDamageCodeApplSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: Date | string) {
    const request = softDeleteCoverageDamageCodeApplsRequestSchema.parse({
      body: ids,
      query: { thruDate: serializeThruDate(thruDate) },
    })
    const response = await getApiClient().put(
      '/coverage-damage-code-appls/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : {},
      }
    )
    return coverageDamageCodeApplSchema.array().parse(response.data)
  },
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/coverage-damage-code-appls/bulk-delete', {
      data: bulkDeleteCoverageDamageCodeApplsRequestSchema.parse(ids),
    })
  },
  async getDamageCodeOptions(input: { signal?: AbortSignal; title?: string }) {
    const response = await getApiClient().get('/damage-codes/page', {
      params: { page: 0, size: 20, title: input.title || undefined },
      signal: input.signal,
    })
    return coverageDamageCodeApplDamageCodePageSchema.parse(response.data)
  },
}
