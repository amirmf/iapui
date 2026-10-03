import { getApiClient } from '@iap/api-client'
import {
  type CoverageForm,
  bulkDeleteCoveragesRequestSchema,
  coveragePageRequestSchema,
  coveragePageSchema,
  coverageSchema,
  createCoverageRequestSchema,
  getCoverageRequestSchema,
  softDeleteCoveragesRequestSchema,
  updateCoverageRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function serializeCoverageForm(input: CoverageForm) {
  return {
    ...input,
    fromDate: input.fromDate.toISOString(),
    thruDate: input.thruDate?.toISOString(),
  }
}

function serializeThruDate(thruDate?: Date | string) {
  return thruDate instanceof Date ? thruDate.toISOString() : thruDate
}

export const coverageService = {
  async bulkDelete(ids: string[]) {
    const request = bulkDeleteCoveragesRequestSchema.parse(ids)
    await getApiClient().delete('/coverages/bulk-delete', { data: request })
  },
  async create(input: CoverageForm) {
    const request = createCoverageRequestSchema.parse(input)
    const response = await getApiClient().post(
      '/coverages',
      serializeCoverageForm(request)
    )
    return coverageSchema.parse(response.data)
  },
  async getById(id: string, options?: { signal?: AbortSignal }) {
    const request = getCoverageRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(`/coverages/${request.path.id}`, {
      signal: options?.signal,
    })
    return coverageSchema.parse(response.data)
  },
  async getPage(input: {
    direction?: 'ASC' | 'DESC'
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
    sort?: string
  }) {
    const request = coveragePageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get('/coverages/page', {
      params: {
        direction: input.direction,
        page: request.page,
        size: request.size,
        sort: input.sort,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return coveragePageSchema.parse(response.data)
  },
  async getPageFull(input: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = coveragePageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get('/coverages/page-full', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return coveragePageSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: Date | string) {
    const request = softDeleteCoveragesRequestSchema.parse({
      body: ids,
      query: { thruDate: serializeThruDate(thruDate) },
    })
    const response = await getApiClient().put(
      '/coverages/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : {},
      }
    )
    return coverageSchema.array().parse(response.data)
  },
  async update(id: string, input: CoverageForm) {
    const request = updateCoverageRequestSchema.parse({
      body: { ...input, id },
      path: { id },
    })
    const response = await getApiClient().patch(
      `/coverages/${request.path.id}`,
      serializeCoverageForm(request.body)
    )
    return coverageSchema.parse(response.data)
  },
}
