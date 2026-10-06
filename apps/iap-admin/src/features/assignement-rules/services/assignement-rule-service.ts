import { getApiClient } from '@iap/api-client'
import {
  type AssignementRule,
  type AssignementRuleRequest,
  type PageAssignementRule,
  assignementRuleIdSchema,
  assignementRuleIdsSchema,
  assignementRulePageRequestSchema,
  assignementRuleRequestSchema,
  assignementRuleSchema,
  pageAssignementRuleSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

function toPayload(data: AssignementRuleRequest) {
  return {
    ...data,
    fromDate: data.fromDate ? data.fromDate.toISOString() : undefined,
    thruDate: data.thruDate ? data.thruDate.toISOString() : undefined,
  }
}

export const assignementRuleService = {
  async getPage(params: {
    filters?: ApiFilterParams
    page?: number
    signal?: AbortSignal
    size?: number
  }): Promise<PageAssignementRule> {
    const request = assignementRulePageRequestSchema.parse({
      filters: params.filters ?? {},
      page: params.page ?? 0,
      size: params.size ?? 30,
    })
    const response = await getApiClient().get('/assignement-rules/page-full', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: params.signal,
    })
    return pageAssignementRuleSchema.parse(response.data)
  },

  async getById(id: string, signal?: AbortSignal): Promise<AssignementRule> {
    const validId = assignementRuleIdSchema.parse(id)
    const response = await getApiClient().get(`/assignement-rules/${validId}`, {
      signal,
    })
    return assignementRuleSchema.parse(response.data)
  },

  async create(data: AssignementRuleRequest): Promise<AssignementRule> {
    const valid = assignementRuleRequestSchema.parse(data)
    const response = await getApiClient().post(
      '/assignement-rules',
      toPayload(valid)
    )
    return assignementRuleSchema.parse(response.data)
  },

  async update(
    id: string,
    data: AssignementRuleRequest
  ): Promise<AssignementRule> {
    const valid = assignementRuleRequestSchema.parse(data)
    const validId = assignementRuleIdSchema.parse(id)
    const response = await getApiClient().put(`/assignement-rules/${validId}`, {
      ...toPayload(valid),
      id: validId,
    })
    return assignementRuleSchema.parse(response.data)
  },

  async delete(id: string): Promise<void> {
    const validId = assignementRuleIdSchema.parse(id)
    await getApiClient().delete(`/assignement-rules/${validId}`)
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const validIds = assignementRuleIdsSchema.parse(ids)
    await getApiClient().delete('/assignement-rules/bulk-delete', {
      data: validIds,
    })
  },
}

export default assignementRuleService
