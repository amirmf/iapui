import { getApiClient } from '@iap/api-client'
import {
  agreementPageRequestSchema,
  agreementSchema,
  getAgreementRequestSchema,
  pageAgreementSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'

export const agreementSelectionService = {
  async getById(id: string, options?: { signal?: AbortSignal }) {
    const request = getAgreementRequestSchema.parse({ path: { id } })
    const response = await getApiClient().get(
      `/agreements/${request.path.id}`,
      { signal: options?.signal }
    )

    return agreementSchema.parse(response.data)
  },
  async getPage(input: { signal?: AbortSignal; title?: string }) {
    const request = agreementPageRequestSchema.parse({
      filters: input.title ? { title: input.title } : {},
      page: 0,
      size: 20,
    })
    const response = await getApiClient().get('/agreements/page', {
      params: {
        page: request.page,
        size: request.size,
        ...transformApiFilterParams(request.filters),
      },
      signal: input.signal,
    })

    return pageAgreementSchema.parse(response.data)
  },
}
