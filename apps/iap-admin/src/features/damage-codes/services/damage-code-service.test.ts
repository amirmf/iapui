import { beforeEach, describe, expect, it, vi } from 'vitest'

import { damageCodeService } from './damage-code-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const damageCodeId = '550e8400-e29b-41d4-a716-446655440000'
const pricing = {
  amount: 120_000,
  damageCodeId,
  id: '550e8400-e29b-41d4-a716-446655440001',
  priceType: 'TOTAL' as const,
}

describe('damageCodeService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses every reference damage-code endpoint with the verified request placement', async () => {
    const signal = new AbortController().signal
    apiClient.get
      .mockResolvedValueOnce({ data: { content: [] } })
      .mockResolvedValueOnce({ data: { id: damageCodeId } })
      .mockResolvedValueOnce({ data: { pricingList: [pricing] } })
    apiClient.post.mockResolvedValue({ data: { id: damageCodeId } })
    apiClient.patch.mockResolvedValue({ data: { id: damageCodeId } })
    apiClient.put
      .mockResolvedValueOnce({ data: { id: damageCodeId } })
      .mockResolvedValueOnce({ data: [{ id: damageCodeId }] })

    await damageCodeService.getPage({
      filters: { status: ['ACTIVE'], thruDate__from: '2026-01-01' },
      page: 1,
      signal,
      size: 40,
    })
    await damageCodeService.getById(damageCodeId, signal)
    await damageCodeService.getPrice({
      damageCodeId: 'reference-allows-non-uuid-id',
      priceType: 'TOTAL',
      year: 1405,
    })
    await damageCodeService.create({
      code: 'D-1',
      status: 'ACTIVE',
      title: 'ویزیت',
    })
    await damageCodeService.update(damageCodeId, {
      code: 'D-1',
      status: 'ACTIVE',
      title: 'ویزیت',
    })
    await damageCodeService.delete(damageCodeId)
    await damageCodeService.softDelete(damageCodeId, '2026-12-31')
    await damageCodeService.softDeleteBulk([damageCodeId], '2026-12-31')
    await damageCodeService.bulkDelete([damageCodeId])

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/damage-codes/page', {
      params: {
        page: 1,
        size: 40,
        status__in: 'ACTIVE',
        thruDate__from: '2026-01-01',
      },
      signal,
    })
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      `/damage-codes/${damageCodeId}`,
      { signal }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      3,
      '/damage-code-pricings/price',
      {
        params: {
          damageCodeId: 'reference-allows-non-uuid-id',
          priceType: 'TOTAL',
          year: 1405,
        },
        signal: undefined,
      }
    )
    expect(apiClient.post).toHaveBeenCalledWith('/damage-codes', {
      code: 'D-1',
      status: 'ACTIVE',
      title: 'ویزیت',
    })
    expect(apiClient.patch).toHaveBeenCalledWith(
      `/damage-codes/${damageCodeId}`,
      {
        code: 'D-1',
        id: damageCodeId,
        status: 'ACTIVE',
        title: 'ویزیت',
      }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      1,
      `/damage-codes/${damageCodeId}`
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      `/damage-codes/soft-delete/${damageCodeId}`,
      null,
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/damage-codes/soft-delete',
      [damageCodeId],
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      2,
      '/damage-codes/bulk-delete',
      {
        data: [damageCodeId],
      }
    )
  })

  it('rejects invalid contracts before transport and enforces reference ISO dates', async () => {
    await expect(damageCodeService.getById('not-a-uuid')).rejects.toThrow()
    await expect(damageCodeService.bulkDelete([])).rejects.toThrow()
    await expect(damageCodeService.softDeleteBulk([])).rejects.toThrow()

    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.delete).not.toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
  })
})
