import {
  claimRequestYesNoSchema,
  registerWithPartyPayloadSchema,
  updateUserAccountPayloadSchema,
  updateWithPartyPayloadSchema,
} from '@iap/api-types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userAccountService } from './user-account-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const user = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'user-account',
}

describe('userAccountService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses reference paths and validates responses', async () => {
    apiClient.get
      .mockResolvedValueOnce({ data: [user] })
      .mockResolvedValueOnce({ data: user })
    apiClient.post
      .mockResolvedValueOnce({ data: user })
      .mockResolvedValueOnce({ data: '' })
    apiClient.put.mockResolvedValueOnce({ data: user })
    apiClient.delete.mockResolvedValue({ data: '' })

    await userAccountService.list({ parentUserAccountId: user.id })
    await userAccountService.getById(user.id)
    await userAccountService.createWithParty({
      password: 'secret',
      username: 'user-account',
    })
    await userAccountService.update(user.id, { username: 'user-account' })
    await userAccountService.delete(user.id)
    await userAccountService.resetPassword(user.id, 'secret')

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/auth/users', {
      params: { parentUserAccountId: user.id },
      signal: undefined,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(2, `/auth/users/${user.id}`, {
      signal: undefined,
    })
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      '/auth/register-with-party',
      { password: 'secret', username: 'user-account' }
    )
    expect(apiClient.put).toHaveBeenCalledWith(`/auth/users/${user.id}`, {
      username: 'user-account',
    })
    expect(apiClient.delete).toHaveBeenCalledWith(`/auth/users/${user.id}`)
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      `/auth/users/${user.id}/reset-password`,
      { password: 'secret' }
    )
  })

  it('validates malformed IDs, request bodies, and filters before transport', async () => {
    await expect(userAccountService.getById('not-a-uuid')).rejects.toThrow()
    await expect(
      userAccountService.createWithParty({ password: 'short', username: 'x' })
    ).rejects.toThrow()
    await expect(
      userAccountService.getPageFull({
        filters: undefined as never,
        page: 0,
        size: 20,
      })
    ).rejects.toThrow()
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
  })

  it('preserves flattened page filters and cancellation', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    await userAccountService.getPageFull({
      direction: 'DESC',
      filters: { enabled: 'true', roles: ['ROLE_ADMIN_USER'] },
      page: 1,
      signal,
      size: 20,
      sort: 'username',
    })
    expect(apiClient.get).toHaveBeenCalledWith('/user-accounts/page-full', {
      params: {
        direction: 'DESC',
        enabled: 'true',
        page: 1,
        roles__in: 'ROLE_ADMIN_USER',
        size: 20,
        sort: 'username',
      },
      signal,
    })
  })

  it('uses the reference Yes/No contract for isCheat payloads', () => {
    expect(claimRequestYesNoSchema.options).toEqual(['Y', 'N'])
    expect(
      updateUserAccountPayloadSchema.safeParse({
        isCheat: 'Y',
        username: 'account',
      }).success
    ).toBe(true)
    expect(
      updateWithPartyPayloadSchema.safeParse({
        isCheat: 'N',
        username: '1234567890',
      }).success
    ).toBe(true)
    expect(
      registerWithPartyPayloadSchema.safeParse({
        isCheat: 'Y',
        password: 'secret',
        username: 'account',
      }).success
    ).toBe(true)
  })
})
