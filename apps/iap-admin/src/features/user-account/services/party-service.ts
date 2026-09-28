import { getApiClient } from '@iap/api-client'
import {
  type Party,
  bulkDeletePartiesRequestSchema,
  createPartyRequestSchema,
  deletePartyRequestSchema,
  emptyPartyActionResponseSchema,
  getPartyRequestSchema,
  pagePartySchema,
  partyListSchema,
  partyPageRequestSchema,
  partySchema,
  patchPartyRequestSchema,
  softDeletePartiesRequestSchema,
  softDeletePartyRequestSchema,
  updatePartyRequestSchema,
} from '@iap/api-types'

export const partyService = {
  async create(input: Party) {
    const request = createPartyRequestSchema.parse(input)
    const response = await getApiClient().post('/parties', request)
    return partySchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deletePartyRequestSchema.parse({ path: { id } })
    const response = await getApiClient().delete(`/parties/${request.path.id}`)
    return emptyPartyActionResponseSchema.parse(response.data)
  },
  async getById(id: string) {
    const request = getPartyRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(`/parties/${request.path.id}`)
    return partySchema.parse(response.data)
  },
  async getPage(input: {
    direction?: string
    filters: Record<string, string | string[]>
    page?: number
    size?: number
    signal?: AbortSignal
    sort?: string
  }) {
    const { signal, ...requestInput } = input
    const request = partyPageRequestSchema.parse(requestInput)
    const response = await getApiClient().get('/parties/page', {
      params: {
        page: request.page,
        size: request.size,
        sort: request.sort,
        direction: request.direction,
        ...request.filters,
      },
      signal,
    })
    return pagePartySchema.parse(response.data)
  },
  async update(id: string, input: Party) {
    const request = updatePartyRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().put(
      `/parties/${request.path.id}`,
      request.body
    )
    return partySchema.parse(response.data)
  },
  async updateUserAccount(id: string, input: Record<string, object>) {
    const request = patchPartyRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().patch(
      `/parties/${request.path.id}`,
      request.body
    )
    return partySchema.parse(response.data)
  },
  async bulkDelete(ids: string[]) {
    const request = bulkDeletePartiesRequestSchema.parse(ids)
    const response = await getApiClient().delete('/parties/bulk-delete', {
      data: request,
    })
    return emptyPartyActionResponseSchema.parse(response.data)
  },
  async softDelete(id: string, thruDate?: string) {
    const request = softDeletePartyRequestSchema.parse({
      path: { id },
      query: { thruDate },
    })
    const response = await getApiClient().put(
      `/parties/soft-delete/${request.path.id}`,
      undefined,
      { params: request.query }
    )
    return partySchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: string) {
    const request = softDeletePartiesRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/parties/soft-delete',
      request.body,
      { params: request.query }
    )
    return partyListSchema.parse(response.data)
  },
}
