import { beforeEach, describe, expect, it, vi } from 'vitest'

import { branchService } from './branch-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}))
vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('branchService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference mutation paths and maps branch form code to a number', async () => {
    apiClient.post
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: { inserted: 1 } })
    apiClient.patch.mockResolvedValue({ data: {} })
    await branchService.create({ code: '201', isActive: 1, name: 'Branch' })
    await branchService.update('branch-1', {
      code: '202',
      isActive: 0,
      name: 'Updated',
    })
    await branchService.delete('branch-1')
    await branchService.sync()
    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/ext-locations', {
      code: 201,
      isActive: 1,
      name: 'Branch',
    })
    expect(apiClient.patch).toHaveBeenCalledWith('/ext-locations/branch-1', {
      code: 202,
      isActive: 0,
      name: 'Updated',
    })
    expect(apiClient.delete).toHaveBeenCalledWith('/ext-locations/branch-1')
    expect(apiClient.post).toHaveBeenNthCalledWith(2, '/ext-locations/sync')
  })

  it('validates branch form input before transport', async () => {
    await expect(
      branchService.create({ code: '', isActive: 2, name: '' })
    ).rejects.toThrow()
    expect(apiClient.post).not.toHaveBeenCalled()
  })
})
