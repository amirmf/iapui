import { beforeEach, describe, expect, it, vi } from 'vitest'

import { repetitiveResponseService } from './repetitive-response-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const responseId = '550e8400-e29b-41d4-a716-446655440000'
const groupId = '550e8400-e29b-41d4-a716-446655440001'
const response = {
  description: 'متن پاسخ',
  id: responseId,
  repetitiveResponseGroupId: groupId,
  seqNum: 1,
  title: 'پاسخ پیگیری',
  usageCount: 2,
}

describe('repetitiveResponseService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference response list defaults, serializes API filters, and rejects malformed pages', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { content: [] } })

    await expect(
      repetitiveResponseService.getPage({
        filters: { groupId: [groupId], title: 'پیگیری' },
      })
    ).resolves.toMatchObject({ content: [] })

    expect(apiClient.get).toHaveBeenCalledWith('/repetitive-responses/page', {
      params: {
        groupId__in: groupId,
        page: 0,
        size: 20,
        title: 'پیگیری',
      },
      signal: undefined,
    })

    apiClient.get.mockResolvedValueOnce({ data: { content: [{ title: 123 }] } })
    await expect(repetitiveResponseService.getPageFull({})).rejects.toThrow()
  })

  it('uses every reference response mutation endpoint with validated payloads', async () => {
    apiClient.get
      .mockResolvedValueOnce({ data: { content: [] } })
      .mockResolvedValueOnce({ data: response })
    apiClient.post.mockResolvedValue({ data: response })
    apiClient.patch.mockResolvedValue({ data: response })
    apiClient.put
      .mockResolvedValueOnce({ data: response })
      .mockResolvedValueOnce({ data: [response] })

    await repetitiveResponseService.getPageFull({ page: 3, size: 10 })
    await repetitiveResponseService.getById(responseId)
    await repetitiveResponseService.create({
      description: response.description,
      repetitiveResponseGroupId: groupId,
      seqNum: 1,
      title: response.title,
      usageCount: 2,
    })
    await repetitiveResponseService.update(responseId, {
      description: response.description,
      repetitiveResponseGroupId: groupId,
      seqNum: 1,
      title: response.title,
      usageCount: 2,
    })
    await repetitiveResponseService.delete(responseId)
    await repetitiveResponseService.softDelete(responseId, '2026-12-31')
    await repetitiveResponseService.softDeleteBulk([responseId], '2026-12-31')
    await repetitiveResponseService.bulkDelete([responseId])

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/repetitive-responses/page-full',
      { params: { page: 3, size: 10 }, signal: undefined }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      `/repetitive-responses/${responseId}`,
      { signal: undefined }
    )
    expect(apiClient.post).toHaveBeenCalledWith('/repetitive-responses', {
      description: response.description,
      repetitiveResponseGroupId: groupId,
      seqNum: 1,
      title: response.title,
      usageCount: 2,
    })
    expect(apiClient.patch).toHaveBeenCalledWith(
      `/repetitive-responses/${responseId}`,
      {
        description: response.description,
        repetitiveResponseGroupId: groupId,
        seqNum: 1,
        title: response.title,
        usageCount: 2,
      }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      1,
      `/repetitive-responses/${responseId}`
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      `/repetitive-responses/soft-delete/${responseId}`,
      null,
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/repetitive-responses/soft-delete',
      [responseId],
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      2,
      '/repetitive-responses/bulk-delete',
      { data: [responseId] }
    )
  })

  it('rejects invalid response requests before transport', async () => {
    await expect(repetitiveResponseService.getById('invalid')).rejects.toThrow()
    await expect(repetitiveResponseService.bulkDelete([])).rejects.toThrow()
    await expect(
      repetitiveResponseService.create({ unexpected: true } as never)
    ).rejects.toThrow()

    expect(apiClient.delete).not.toHaveBeenCalled()
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
  })
})
