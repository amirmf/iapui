import { getApiClient } from '@iap/api-client'
import { pageDocTypeRequestSchema, pageDocTypeSchema } from '@iap/api-types'

export const docTypeOptionsService = {
  findPage: async (signal?: AbortSignal) => {
    const request = pageDocTypeRequestSchema.parse({ page: 0, size: 100 })
    const response = await getApiClient().get('/doc-types/page', {
      params: request,
      signal,
    })

    return pageDocTypeSchema.parse(response.data)
  },
}
