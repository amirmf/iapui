import { beforeEach, describe, expect, it, vi } from 'vitest'

import { otpService } from './otp-service'

const apiClient = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const pageResponse = {
  content: [],
  empty: true,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 30,
  totalElements: 0,
  totalPages: 0,
}

describe('otpService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference endpoints and flattened query parameters', async () => {
    apiClient.get.mockResolvedValue({ data: pageResponse })
    const signal = new AbortController().signal

    await otpService.listSignupOtps({
      direction: 'DESC',
      filters: { nationalCode: '0012345678', phoneNumber: '09120000000' },
      page: 2,
      signal,
      size: 50,
      sort: 'otpCreatedAt',
    })
    await otpService.listPasswordResetOtps({
      filters: { phoneNumber: '09120000000' },
      page: 1,
      signal,
      size: 30,
    })

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/auth/signup/otp', {
      params: {
        direction: 'DESC',
        nationalCode: '0012345678',
        page: 2,
        phoneNumber: '09120000000',
        size: 50,
        sort: 'otpCreatedAt',
      },
      signal,
      timeout: 60_000,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      '/auth/password-reset/otp',
      {
        params: {
          direction: undefined,
          page: 1,
          phoneNumber: '09120000000',
          size: 30,
          sort: undefined,
        },
        signal,
        timeout: 60_000,
      }
    )
  })

  it('applies source-backed defaults and validates both boundaries', async () => {
    apiClient.get.mockResolvedValue({ data: pageResponse })

    await otpService.listSignupOtps({ filters: {} })

    expect(apiClient.get).toHaveBeenCalledWith('/auth/signup/otp', {
      params: { direction: undefined, page: 0, size: 30, sort: undefined },
      signal: undefined,
      timeout: 60_000,
    })

    await expect(
      otpService.listPasswordResetOtps({ filters: {}, page: -1 })
    ).rejects.toThrow()
    expect(apiClient.get).toHaveBeenCalledTimes(1)

    apiClient.get.mockResolvedValueOnce({ data: { content: [] } })
    await expect(otpService.listSignupOtps({ filters: {} })).rejects.toThrow()
  })
})
