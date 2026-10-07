import { getApiClient } from '@iap/api-client'
import {
  type PageSupportPage,
  type SupportPage,
  type SupportPagePayload,
  type SupportPageRequest,
  emptySupportPageActionResponseSchema,
  pageSupportPageSchema,
  supportPageByIdRequestSchema,
  supportPagePayloadSchema,
  supportPageRequestSchema,
  supportPageSchema,
  updateSupportPageRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

const basePath = '/support/pages'

export type SupportPageParams = SupportPageRequest & { signal?: AbortSignal }

export const supportPageService = {
  getPage: async (params: SupportPageParams): Promise<PageSupportPage> => {
    const { signal, ...input } = params
    const {
      page = 0,
      size = 30,
      filters,
      sort,
      direction,
    } = supportPageRequestSchema.parse(input)
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
    return pageSupportPageSchema.parse(response.data)
  },

  create: async (data: SupportPagePayload): Promise<SupportPage> => {
    const response = await getApiClient().post(
      basePath,
      supportPagePayloadSchema.parse(data)
    )
    return supportPageSchema.parse(response.data)
  },

  update: async (
    id: string,
    data: SupportPagePayload
  ): Promise<SupportPage> => {
    const request = updateSupportPageRequestSchema.parse({
      path: { id },
      body: { id, ...data },
    })
    const response = await getApiClient().put(
      `${basePath}/${request.path.id}`,
      request.body
    )
    return supportPageSchema.parse(response.data)
  },

  delete: async (id: string): Promise<void> => {
    const request = supportPageByIdRequestSchema.parse({ path: { id } })
    const response = await getApiClient().delete(
      `${basePath}/${request.path.id}`
    )
    return emptySupportPageActionResponseSchema.parse(response.data)
  },
}

export default supportPageService
