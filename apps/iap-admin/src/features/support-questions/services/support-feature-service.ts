import { getApiClient } from '@iap/api-client'
import {
  type PageSupportFeature,
  type SupportFeature,
  type SupportFeaturePayload,
  type SupportFeatureRequest,
  emptySupportFeatureActionResponseSchema,
  pageSupportFeatureSchema,
  supportFeatureByIdRequestSchema,
  supportFeaturePayloadSchema,
  supportFeatureRequestSchema,
  supportFeatureSchema,
  updateSupportFeatureRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

const basePath = '/support/features'

export type SupportFeatureParams = SupportFeatureRequest & {
  signal?: AbortSignal
}

export const supportFeatureService = {
  getPage: async (
    params: SupportFeatureParams
  ): Promise<PageSupportFeature> => {
    const { signal, ...input } = params
    const {
      page = 0,
      size = 30,
      filters,
      sort,
      direction,
    } = supportFeatureRequestSchema.parse(input)
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
    return pageSupportFeatureSchema.parse(response.data)
  },

  create: async (data: SupportFeaturePayload): Promise<SupportFeature> => {
    const response = await getApiClient().post(
      basePath,
      supportFeaturePayloadSchema.parse(data)
    )
    return supportFeatureSchema.parse(response.data)
  },

  update: async (
    id: string,
    data: SupportFeaturePayload
  ): Promise<SupportFeature> => {
    const request = updateSupportFeatureRequestSchema.parse({
      path: { id },
      body: { id, ...data },
    })
    const response = await getApiClient().put(
      `${basePath}/${request.path.id}`,
      request.body
    )
    return supportFeatureSchema.parse(response.data)
  },

  delete: async (id: string): Promise<void> => {
    const request = supportFeatureByIdRequestSchema.parse({ path: { id } })
    const response = await getApiClient().delete(
      `${basePath}/${request.path.id}`
    )
    return emptySupportFeatureActionResponseSchema.parse(response.data)
  },
}

export default supportFeatureService
