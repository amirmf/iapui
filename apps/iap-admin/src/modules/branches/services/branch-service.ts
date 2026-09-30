import { getApiClient } from '@iap/api-client'
import {
  type BranchForm,
  branchPageRequestSchema,
  branchPageSchema,
  branchSchema,
  createBranchRequestSchema,
  deleteBranchRequestSchema,
  syncBranchesRequestSchema,
  syncResultSchema,
  updateBranchRequestSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

export const branchService = {
  async create(input: BranchForm) {
    const request = createBranchRequestSchema.parse(input)
    const response = await getApiClient().post('/ext-locations', {
      code: Number(request.code),
      name: request.name,
      isActive: request.isActive,
    })
    return branchSchema.parse(response.data)
  },
  async delete(id: string) {
    const request = deleteBranchRequestSchema.parse({ path: { id } })
    await getApiClient().delete(`/ext-locations/${request.path.id}`)
  },
  async getPage(input: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }) {
    const request = branchPageRequestSchema.parse({
      filters: input.filters ?? {},
      page: input.page ?? 0,
      size: input.size ?? 20,
    })
    const response = await getApiClient().get('/ext-locations/page', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })
    return branchPageSchema.parse(response.data)
  },
  async sync() {
    syncBranchesRequestSchema.parse({})
    const response = await getApiClient().post('/ext-locations/sync')
    return syncResultSchema.parse(response.data)
  },
  async update(id: string, input: BranchForm) {
    const request = updateBranchRequestSchema.parse({
      body: input,
      path: { id },
    })
    const response = await getApiClient().patch(
      `/ext-locations/${request.path.id}`,
      {
        code: Number(request.body.code),
        name: request.body.name,
        isActive: request.body.isActive,
      }
    )
    return branchSchema.parse(response.data)
  },
}
