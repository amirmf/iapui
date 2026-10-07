import { getApiClient } from '@iap/api-client'
import {
  type CreateSupportQuestionPayload,
  type PageSupportQuestion,
  type SupportQuestion,
  type SupportQuestionPageRequest,
  type UpdateSupportQuestionPayload,
  bulkDeleteSupportQuestionsRequestSchema,
  deleteSupportQuestionRequestSchema,
  emptySupportQuestionActionResponseSchema,
  getSupportQuestionRequestSchema,
  pageSupportQuestionSchema,
  supportQuestionPageRequestSchema,
  supportQuestionPayloadSchema,
  supportQuestionSchema,
  updateSupportQuestionSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

const basePath = '/support/questions'

export type SupportQuestionPageParams = SupportQuestionPageRequest & {
  signal?: AbortSignal
}

export const supportQuestionService = {
  getPage: async (
    params: SupportQuestionPageParams
  ): Promise<PageSupportQuestion> => {
    const { signal, ...input } = params
    const {
      page = 0,
      size = 30,
      filters,
      sort,
      direction,
    } = supportQuestionPageRequestSchema.parse(input)
    const response = await getApiClient().get(`${basePath}/page`, {
      params: {
        page,
        size,
        sort,
        direction,
        ...transformApiFilterParams(filters),
      },
      signal,
    })
    return pageSupportQuestionSchema.parse(response.data)
  },

  getPageFull: async (
    params: SupportQuestionPageParams
  ): Promise<PageSupportQuestion> => {
    const { signal, ...input } = params
    const {
      page = 0,
      size = 30,
      filters,
      sort,
      direction,
    } = supportQuestionPageRequestSchema.parse(input)
    const response = await getApiClient().get(`${basePath}/page-full`, {
      params: {
        page,
        size,
        sort,
        direction,
        ...transformApiFilterParams(filters),
      },
      signal,
    })
    return pageSupportQuestionSchema.parse(response.data)
  },

  getById: async (
    id: string,
    options?: { signal?: AbortSignal }
  ): Promise<SupportQuestion> => {
    const request = getSupportQuestionRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `${basePath}/${request.path.id}`,
      {
        signal: options?.signal,
      }
    )
    return supportQuestionSchema.parse(response.data)
  },

  create: async (
    data: CreateSupportQuestionPayload
  ): Promise<SupportQuestion> => {
    const payload = supportQuestionPayloadSchema.parse(data)
    const response = await getApiClient().post(basePath, payload)
    return supportQuestionSchema.parse(response.data)
  },

  update: async (
    id: string,
    data: Omit<UpdateSupportQuestionPayload, 'id'>
  ): Promise<SupportQuestion> => {
    const request = updateSupportQuestionSchema.parse({
      path: { id },
      body: { id, ...data },
    })
    const response = await getApiClient().put(
      `${basePath}/${request.path.id}`,
      request.body
    )
    return supportQuestionSchema.parse(response.data)
  },

  delete: async (id: string): Promise<void> => {
    const request = deleteSupportQuestionRequestSchema.parse({ path: { id } })
    const response = await getApiClient().delete(
      `${basePath}/${request.path.id}`
    )
    return emptySupportQuestionActionResponseSchema.parse(response.data)
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    const request = bulkDeleteSupportQuestionsRequestSchema.parse(ids)
    const response = await getApiClient().delete(`${basePath}/bulk-delete`, {
      data: request,
    })
    return emptySupportQuestionActionResponseSchema.parse(response.data)
  },
}

export default supportQuestionService
