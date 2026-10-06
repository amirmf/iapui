import { getApiClient } from '@iap/api-client'
import {
  type AssessmentPromptForm,
  type PageAssessmentPromptsRequest,
  assessmentPromptFormSchema,
  assessmentPromptListSchema,
  assessmentPromptSchema,
  bulkDeleteAssessmentPromptsRequestSchema,
  createAssessmentPromptRequestSchema,
  deleteAssessmentPromptRequestSchema,
  emptyAssessmentPromptActionResponseSchema,
  getAssessmentPromptRequestSchema,
  pageAssessmentPromptSchema,
  pageAssessmentPromptsRequestSchema,
  softDeleteAssessmentPromptRequestSchema,
  softDeleteAssessmentPromptsRequestSchema,
  updateAssessmentPromptRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

function toRequest(values: AssessmentPromptForm) {
  const input = assessmentPromptFormSchema.parse(values)
  return createAssessmentPromptRequestSchema.parse({
    ...input,
    fromDate: input.fromDate.toISOString(),
    thruDate: input.thruDate?.toISOString(),
  })
}

export const assessmentPromptService = {
  async delete(id: string) {
    const request = deleteAssessmentPromptRequestSchema.parse({ path: { id } })
    const { data } = await getApiClient().delete(
      `/assessment-prompts/${request.path.id}`
    )
    return emptyAssessmentPromptActionResponseSchema.parse(data)
  },
  async bulkDelete(ids: string[]) {
    const request = bulkDeleteAssessmentPromptsRequestSchema.parse(ids)
    const { data } = await getApiClient().delete(
      '/assessment-prompts/bulk-delete',
      { data: request }
    )
    return emptyAssessmentPromptActionResponseSchema.parse(data)
  },
  async create(values: AssessmentPromptForm) {
    const response = await getApiClient().post(
      '/assessment-prompts',
      toRequest(values)
    )
    return assessmentPromptSchema.parse(response.data)
  },
  async getById(id: string, options?: { signal?: AbortSignal }) {
    const request = getAssessmentPromptRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/assessment-prompts/${request.path.id}`,
      { signal: options?.signal }
    )
    return assessmentPromptSchema.parse(response.data)
  },
  async getPage(
    params: PageAssessmentPromptsRequest & { signal?: AbortSignal }
  ) {
    const { signal, ...input } = params
    const {
      page = 0,
      size = 30,
      filters,
    } = pageAssessmentPromptsRequestSchema.parse(input)
    const response = await getApiClient().get('/assessment-prompts/page-full', {
      params: {
        page,
        size,
        ...transformApiFilterParams(filters),
      },
      signal,
    })
    return pageAssessmentPromptSchema.parse(response.data)
  },
  async softDelete(id: string, thruDate?: string) {
    const request = softDeleteAssessmentPromptRequestSchema.parse({
      path: { id },
      query: { thruDate },
    })
    const response = await getApiClient().put(
      `/assessment-prompts/soft-delete/${request.path.id}`,
      undefined,
      { params: request.query }
    )
    return assessmentPromptSchema.parse(response.data)
  },
  async softDeleteBulk(ids: string[], thruDate?: string) {
    const request = softDeleteAssessmentPromptsRequestSchema.parse({
      body: ids,
      query: { thruDate },
    })
    const response = await getApiClient().put(
      '/assessment-prompts/soft-delete',
      request.body,
      { params: request.query }
    )
    return assessmentPromptListSchema.parse(response.data)
  },
  async update(id: string, values: AssessmentPromptForm) {
    const request = updateAssessmentPromptRequestSchema.parse({
      body: toRequest(values),
      path: { id },
    })
    const response = await getApiClient().put(
      `/assessment-prompts/${request.path.id}`,
      request.body
    )
    return assessmentPromptSchema.parse(response.data)
  },
}

export default assessmentPromptService
