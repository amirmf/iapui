import { getApiClient } from '@iap/api-client'
import {
  type GetPreAuthsRequest,
  type PagePreAuth,
  getPreAuthsRequestSchema,
  pagePreAuthSchema,
} from '@iap/api-types'

export async function getPreAuthsPage(
  request: GetPreAuthsRequest,
  signal?: AbortSignal
): Promise<PagePreAuth> {
  const params = getPreAuthsRequestSchema.parse(request)
  const response = await getApiClient().get<unknown>(
    '/my/iap/pre-auths/page-full',
    {
      params,
      signal,
    }
  )

  return pagePreAuthSchema.parse(response.data)
}

export const preAuthService = {
  getPage: getPreAuthsPage,
}
