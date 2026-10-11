import { agentUserService } from '@features/agent-users/services/agent-user-service'
import { getApiClient } from '@iap/api-client'
import { agentSignupRequestSchema } from '@iap/api-types'
import { useAuthStore } from '@iap/auth'
import { CanceledError } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@iap/api-client', () => ({ getApiClient: vi.fn() }))
vi.mock('@iap/auth', () => ({ useAuthStore: { getState: vi.fn() } }))

const payload = {
  phoneNumber: ' 09123456789 ',
  nationalCode: ' any identifier ',
  password: ' secret ',
  nationalityType: 'IR' as const,
}

describe('agent signup contract and service', () => {
  const post = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore.getState).mockReturnValue({ user: null } as never)
    vi.mocked(getApiClient).mockReturnValue({ post } as never)
  })

  it('rejects forced-password signup before POST with the source cancellation', async () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      user: { isPasswordChangeForced: 'Y' },
    } as never)
    await expect(agentUserService.signup(payload)).rejects.toBeInstanceOf(
      CanceledError
    )
    await expect(agentUserService.signup(payload)).rejects.toMatchObject({
      code: 'ERR_CANCELED',
      message: 'Password change is required before other requests.',
    })
    expect(post).not.toHaveBeenCalled()
  })

  it('defaults nationality and strips additional keys while preserving password', () => {
    expect(
      agentSignupRequestSchema.parse({
        phoneNumber: '+989123456789',
        nationalCode: ' foreign ',
        password: ' secret ',
        confirmPassword: 'discard me',
      })
    ).toEqual({
      phoneNumber: '+989123456789',
      nationalCode: 'foreign',
      password: ' secret ',
      nationalityType: 'IR',
    })
  })

  it.each([
    { phoneNumber: '1234' },
    { nationalCode: ' ' },
    { password: 'short' },
    { password: ' '.repeat(6) },
    { password: 'a'.repeat(256) },
    { nationalityType: 'OTHER' },
  ])('rejects invalid request %j before transport', async (override) => {
    await expect(
      agentUserService.signup({ ...payload, ...override } as never)
    ).rejects.toThrow()
    expect(post).not.toHaveBeenCalled()
  })

  it.each(['', undefined])(
    'accepts the reference empty response %j',
    async (data) => {
      post.mockResolvedValueOnce({ data })
      await expect(
        agentUserService.signup({ ...payload, extra: true } as never)
      ).resolves.toBeUndefined()
      expect(post).toHaveBeenCalledExactlyOnceWith(
        '/claim-request-registery-agent/users',
        {
          phoneNumber: '09123456789',
          nationalCode: 'any identifier',
          password: ' secret ',
          nationalityType: 'IR',
        }
      )
    }
  )

  it.each([null, {}, [], 'ok', 0])(
    'rejects nonempty response %j',
    async (data) => {
      post.mockResolvedValueOnce({ data })
      await expect(agentUserService.signup(payload)).rejects.toThrow()
    }
  )
})
