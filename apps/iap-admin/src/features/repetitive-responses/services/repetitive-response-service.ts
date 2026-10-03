import { getApiClient } from '@iap/api-client'
import {
  type RepetitiveResponseRequest,
  bulkDeleteRepetitiveResponsesRequestSchema,
  createRepetitiveResponseRequestSchema,
  deleteRepetitiveResponseRequestSchema,
  getRepetitiveResponseRequestSchema,
  repetitiveResponsePageRequestSchema,
  repetitiveResponsePageSchema,
  repetitiveResponseSchema,
  softDeleteRepetitiveResponsesRequestSchema,
  updateRepetitiveResponseRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

type PageInput = {
  filters?: ApiFilterParams
  page?: number
  signal?: AbortSignal
  size?: number
}

function parsePageRequest(input: PageInput) {
  return repetitiveResponsePageRequestSchema.parse({
    filters: input.filters ?? {},
    page: input.page ?? 0,
    size: input.size ?? 20,
  })
}

export const repetitiveResponseService = {
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/repetitive-responses/bulk-delete', {
      data: bulkDeleteRepetitiveResponsesRequestSchema.parse(ids),
    })
  },
  async create(input: RepetitiveResponseRequest) {
    const request = createRepetitiveResponseRequestSchema.parse(input)
    const response = await getApiClient().post('/repetitive-responses', request)
    return repetitiveResponseSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteRepetitiveResponseRequestSchema.parse({
      path: { id },
    })
    await getApiClient().delete(`/repetitive-responses/${request.path.id}`)
  },
  async getById(id: string, options?: { signal?: AbortSignal }) {
    const request = getRepetitiveResponseRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/repetitive-responses/${request.path.id}`,
      { signal: options?.signal }
    )
    return repetitiveResponseSchema.parse(response.data)
  },
  async getPage(input: PageInput) {
    const request = parsePageRequest(input)
    const response = await getApiClient().get('/repetitive-responses/page', {
      params: {
        ...transformApiFilterParams(request.filters),
        page: request.page,
        size: request.size,
      },
      signal: input.signal,
    })
    return repetitiveResponsePageSchema.parse(response.data)
  },
  async getPageFull(input: PageInput) {
    const request = parsePageRequest(input)
    const response = await getApiClient().get(
      '/repetitive-responses/page-full',
      {
        params: {
          ...transformApiFilterParams(request.filters),
          page: request.page,
          size: request.size,
        },
        signal: input.signal,
      }
    )
    return repetitiveResponsePageSchema.parse(response.data)
  },
  async softDelete(id: string, thruDate?: string) {
    const request = getRepetitiveResponseRequestSchema.parse({ path: { id } })
    const response = await getApiClient().put(
      `/repetitive-responses/soft-delete/${request.path.id}`,
      null,
      { params: thruDate ? { thruDate } : {} }
    )
    return repetitiveResponseSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: string) {
    const request = softDeleteRepetitiveResponsesRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/repetitive-responses/soft-delete',
      request.body,
      {
        params: request.query.thruDate
          ? { thruDate: request.query.thruDate }
          : {},
      }
    )
    return repetitiveResponseSchema.array().parse(response.data)
  },
  async update(id: string, input: RepetitiveResponseRequest) {
    const request = updateRepetitiveResponseRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().patch(
      `/repetitive-responses/${request.path.id}`,
      request.body
    )
    return repetitiveResponseSchema.parse(response.data)
  },
}

export default repetitiveResponseService
