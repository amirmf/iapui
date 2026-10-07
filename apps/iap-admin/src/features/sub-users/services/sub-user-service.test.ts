import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { subUserService } from './sub-user-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('subUserService', () => {
  const mockGet = vi.fn()
  const mockPost = vi.fn()
  const mockPut = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getApiClient).mockReturnValue({
      get: mockGet,
      post: mockPost,
      put: mockPut,
    } as never)
  })

  it('calls getById with valid id', async () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000'
    mockGet.mockResolvedValueOnce({
      data: {
        id: validId,
        username: '0123456789',
      },
    })

    const result = await subUserService.getById(validId)
    expect(mockGet).toHaveBeenCalledWith(`/auth/sub-users/${validId}`, {
      signal: undefined,
    })
    expect(result.id).toBe(validId)
  })

  it('rejects getById with invalid uuid', async () => {
    await expect(subUserService.getById('invalid-id')).rejects.toThrow()
  })

  it('calls disable with valid id', async () => {
    const validId = '123e4567-e89b-12d3-a456-426614174000'
    mockPost.mockResolvedValueOnce({
      data: {
        enabled: false,
        id: validId,
        username: '0123456789',
      },
    })

    const result = await subUserService.disable(validId)
    expect(mockPost).toHaveBeenCalledWith(`/auth/sub-users/${validId}/disable`)
    expect(result.enabled).toBe(false)
  })

  it('calls releaseAssignments', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        releasedCount: 2,
      },
    })

    const result = await subUserService.releaseAssignments({ userId: 'user-1' })
    expect(mockPost).toHaveBeenCalledWith(
      '/claim-requests/assignments/release',
      {
        userId: 'user-1',
      }
    )
    expect(result.releasedCount).toBe(2)
  })
})
