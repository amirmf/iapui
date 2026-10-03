import { getApiClient } from '@iap/api-client'
import {
  type OtpListRequest,
  otpListRequestSchema,
  pagePasswordResetOtpListSchema,
  pageSignupOtpListSchema,
} from '@iap/api-types'
import { type ApiFilterParams, transformApiFilterParams } from '@iap/shared-lib'

type OtpListInput = {
  direction?: OtpListRequest['direction']
  filters: OtpListRequest['filters']
  page?: number
  signal?: AbortSignal
  size?: number
  sort?: OtpListRequest['sort']
}

const timeout = 60 * 1000

function parseRequest(input: OtpListInput) {
  const { signal, ...requestInput } = input

  return { request: otpListRequestSchema.parse(requestInput), signal }
}

export const otpService = {
  async listPasswordResetOtps(input: OtpListInput) {
    const { request, signal } = parseRequest(input)
    const response = await getApiClient().get('/auth/password-reset/otp', {
      params: {
        ...transformApiFilterParams(request.filters as ApiFilterParams),
        direction: request.direction,
        page: request.page,
        size: request.size,
        sort: request.sort,
      },
      signal,
      timeout,
    })

    return pagePasswordResetOtpListSchema.parse(response.data)
  },
  async listSignupOtps(input: OtpListInput) {
    const { request, signal } = parseRequest(input)
    const response = await getApiClient().get('/auth/signup/otp', {
      params: {
        ...transformApiFilterParams(request.filters as ApiFilterParams),
        direction: request.direction,
        page: request.page,
        size: request.size,
        sort: request.sort,
      },
      signal,
      timeout,
    })

    return pageSignupOtpListSchema.parse(response.data)
  },
}
