import { getApiClient } from '@iap/api-client'
import {
  type RepetitiveResponseGroupRequest,
  bulkDeleteRepetitiveResponseGroupsRequestSchema,
  createRepetitiveResponseGroupRequestSchema,
  deleteRepetitiveResponseGroupRequestSchema,
  getRepetitiveResponseGroupRequestSchema,
  repetitiveResponseGroupPageRequestSchema,
  repetitiveResponseGroupPageSchema,
  repetitiveResponseGroupSchema,
  softDeleteRepetitiveResponseGroupsRequestSchema,
  updateRepetitiveResponseGroupRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

type PageInput = {
  filters?: ApiFilterParams
  page?: number
  signal?: AbortSignal
  size?: number
}

export const repetitiveResponseGroupService = {
  async bulkDelete(ids: string[]) {
    await getApiClient().delete('/repetitive-response-groups/bulk-delete', {
      data: bulkDeleteRepetitiveResponseGroupsRequestSchema.parse(ids),
    })
  },
  async create(input: RepetitiveResponseGroupRequest) {
    const request = createRepetitiveResponseGroupRequestSchema.parse(input)
    const response = await getApiClient().post(
      '/repetitive-response-groups',
      request
    )
    return repetitiveResponseGroupSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteRepetitiveResponseGroupRequestSchema.parse({
      path: { id },
    })
    await getApiClient().delete(`/repetitive-response-groups/${request.path.id}`)
  },
  async getById(id: string, options?: { signal?: AbortSignal }) {
    const request = getRepetitiveResponseGroupRequestSchema.parse({
      path: { id },
    })
    const response = await getApiClient().get(
      `/repetitive-response-groups/${request.path.id}`,
      { signal: options?.signal }
    )
    return repetitiveResponseGroupSchema.parse(response.data)
  },
  async getPage(input: PageInput) {
    const request = repetitiveResponseGroupPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 30,
    })
    const response = await getApiClient().get('/repetitive-response-groups/page', {
      params: {
        ...transformApiFilterParams(request.filters),
        page: request.page,
        size: request.size,
      },
      signal: input.signal,
    })
    return repetitiveResponseGroupPageSchema.parse(response.data)
  },
  async softDelete(id: string, thruDate?: string) {
    const request = getRepetitiveResponseGroupRequestSchema.parse({
      path: { id },
    })
    const response = await getApiClient().put(
      `/repetitive-response-groups/soft-delete/${request.path.id}`,
      null,
      { params: thruDate ? { thruDate } : {} }
    )
    return repetitiveResponseGroupSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: string) {
    const request = softDeleteRepetitiveResponseGroupsRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/repetitive-response-groups/soft-delete',
      request.body,
      { params: request.query.thruDate ? { thruDate: request.query.thruDate } : {} }
    )
    return repetitiveResponseGroupSchema.array().parse(response.data)
  },
  async update(id: string, input: RepetitiveResponseGroupRequest) {
    const request = updateRepetitiveResponseGroupRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().put(
      `/repetitive-response-groups/${request.path.id}`,
      request.body
    )
    return repetitiveResponseGroupSchema.parse(response.data)
  },
}

export default repetitiveResponseGroupService
