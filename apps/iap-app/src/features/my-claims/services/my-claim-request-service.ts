import { getApiClient } from '@iap/api-client'
import {
  claimRequestIdSchema,
  claimRequestVoidResponseSchema,
  myClaimRequestPageRequestSchema,
  pageClaimRequestSchema,
} from '@iap/api-types'
import { transformApiFilterParams } from '@iap/shared-lib'
import type { z } from 'zod'

type PageParams = z.input<typeof myClaimRequestPageRequestSchema> & {
  signal?: AbortSignal
}

export const myClaimRequestService = {
  getPage: async (params: PageParams) => {
    const { signal, ...request } = params
    const { page, size, filters } =
      myClaimRequestPageRequestSchema.parse(request)
    const response = await getApiClient().get<unknown>(
      '/my/iap/claim-requests/page-full',
      {
        params: { page, size, ...transformApiFilterParams(filters) },
        signal,
      }
    )
    return pageClaimRequestSchema.parse(response.data)
  },
  delete: async (id: string): Promise<void> => {
    const claimId = claimRequestIdSchema.parse(id)
    const response = await getApiClient().delete<unknown>(
      `/my/iap/claim-requests/${claimId}`
    )
    claimRequestVoidResponseSchema.parse(response.data)
  },
}
export default myClaimRequestService
