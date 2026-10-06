import { getApiClient } from '@iap/api-client'
import {
  type AiAssessmentRule,
  type CreateAiAssessmentRuleRequest,
  type ListAiAssessmentRulesRequest,
  type PageAiAssessmentRule,
  type UpdateAiAssessmentRuleRequest,
  aiAssessmentRuleSchema,
  bulkDeleteAiAssessmentRulesRequestSchema,
  createAiAssessmentRuleRequestSchema,
  emptyAiAssessmentRuleActionResponseSchema,
  getAiAssessmentRuleRequestSchema,
  listAiAssessmentRulesRequestSchema,
  pageAiAssessmentRuleSchema,
  updateAiAssessmentRuleRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

export const aiAssessmentRuleService = {
  bulkDelete: async (ids: string[]): Promise<void> => {
    const parsed = bulkDeleteAiAssessmentRulesRequestSchema.parse(ids)
    const response = await getApiClient().delete(
      '/ai-assessment-rules/bulk-delete',
      { data: parsed }
    )
    return emptyAiAssessmentRuleActionResponseSchema.parse(response.data)
  },

  create: async (
    request: CreateAiAssessmentRuleRequest
  ): Promise<AiAssessmentRule> => {
    const parsed = createAiAssessmentRuleRequestSchema.parse(request)
    const response = await getApiClient().post('/ai-assessment-rules', parsed)
    return aiAssessmentRuleSchema.parse(response.data)
  },

  delete: async (id: string): Promise<void> => {
    const parsed = getAiAssessmentRuleRequestSchema.parse({ id })
    const response = await getApiClient().delete(
      `/ai-assessment-rules/${parsed.id}`
    )
    return emptyAiAssessmentRuleActionResponseSchema.parse(response.data)
  },

  getById: async (
    id: string,
    signal?: AbortSignal
  ): Promise<AiAssessmentRule> => {
    const parsed = getAiAssessmentRuleRequestSchema.parse({ id })
    const response = await getApiClient().get(
      `/ai-assessment-rules/${parsed.id}`,
      { signal }
    )
    return aiAssessmentRuleSchema.parse(response.data)
  },

  list: async (
    request: ListAiAssessmentRulesRequest,
    signal?: AbortSignal
  ): Promise<PageAiAssessmentRule> => {
    const parsed = listAiAssessmentRulesRequestSchema.parse(request)
    const response = await getApiClient().get(
      '/ai-assessment-rules/page-full',
      {
        params: {
          direction: parsed.direction,
          page: parsed.page,
          size: parsed.size,
          sort: parsed.sort,
          ...transformApiFilterParams(parsed.filters),
        },
        signal,
      }
    )
    return pageAiAssessmentRuleSchema.parse(response.data)
  },

  update: async (
    request: UpdateAiAssessmentRuleRequest
  ): Promise<AiAssessmentRule> => {
    const parsed = updateAiAssessmentRuleRequestSchema.parse(request)
    const response = await getApiClient().put(
      `/ai-assessment-rules/${parsed.id}`,
      parsed.data
    )
    return aiAssessmentRuleSchema.parse(response.data)
  },
}
