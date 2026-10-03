import { beforeEach, describe, expect, it, vi } from 'vitest'

import { repetitiveResponseGroupService } from './repetitive-response-group-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const groupId = '550e8400-e29b-41d4-a716-446655440001'
const group = { id: groupId, seqNum: 1, title: 'پشتیبانی' }

describe('repetitiveResponseGroupService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference group list defaults and validates its page response', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { content: [] } })

    await expect(
      repetitiveResponseGroupService.getPage({ filters: { title: 'پشتیبانی' } })
    ).resolves.toMatchObject({ content: [] })

    expect(apiClient.get).toHaveBeenCalledWith(
      '/repetitive-response-groups/page',
      {
        params: { page: 0, size: 30, title: 'پشتیبانی' },
        signal: undefined,
      }
    )

    apiClient.get.mockResolvedValueOnce({ data: { content: [{ title: 123 }] } })
    await expect(repetitiveResponseGroupService.getPage({})).rejects.toThrow()
  })

  it('uses every reference group mutation endpoint with validated payloads', async () => {
    apiClient.get.mockResolvedValue({ data: group })
    apiClient.post.mockResolvedValue({ data: group })
    apiClient.put
      .mockResolvedValueOnce({ data: group })
      .mockResolvedValueOnce({ data: group })
      .mockResolvedValueOnce({ data: [group] })

    await repetitiveResponseGroupService.getById(groupId)
    await repetitiveResponseGroupService.create({ seqNum: 1, title: 'پشتیبانی' })
    await repetitiveResponseGroupService.update(groupId, {
      seqNum: 1,
      title: 'پشتیبانی',
    })
    await repetitiveResponseGroupService.delete(groupId)
    await repetitiveResponseGroupService.softDelete(groupId, '2026-12-31')
    await repetitiveResponseGroupService.softDeleteBulk([groupId], '2026-12-31')
    await repetitiveResponseGroupService.bulkDelete([groupId])

    expect(apiClient.get).toHaveBeenCalledWith(
      `/repetitive-response-groups/${groupId}`,
      { signal: undefined }
    )
    expect(apiClient.post).toHaveBeenCalledWith('/repetitive-response-groups', {
      seqNum: 1,
      title: 'پشتیبانی',
    })
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      `/repetitive-response-groups/${groupId}`,
      { seqNum: 1, title: 'پشتیبانی' }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      1,
      `/repetitive-response-groups/${groupId}`
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      `/repetitive-response-groups/soft-delete/${groupId}`,
      null,
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      3,
      '/repetitive-response-groups/soft-delete',
      [groupId],
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      2,
      '/repetitive-response-groups/bulk-delete',
      { data: [groupId] }
    )
  })

  it('rejects invalid group requests before transport', async () => {
    await expect(repetitiveResponseGroupService.getById('invalid')).rejects.toThrow()
    await expect(repetitiveResponseGroupService.bulkDelete([])).rejects.toThrow()
    await expect(
      repetitiveResponseGroupService.create({ unexpected: true } as never)
    ).rejects.toThrow()

    expect(apiClient.delete).not.toHaveBeenCalled()
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
  })
})
