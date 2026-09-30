import { beforeEach, describe, expect, it, vi } from 'vitest'

import { damageCodePricingService } from './damage-code-pricing-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const damageCodeId = '550e8400-e29b-41d4-a716-446655440000'
const pricingId = '550e8400-e29b-41d4-a716-446655440001'
const pricing = {
  amount: 120_000,
  damageCodeId,
  id: pricingId,
  priceType: 'TOTAL' as const,
}

describe('damageCodePricingService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses all reference pricing endpoints and preserves request placement', async () => {
    const signal = new AbortController().signal
    apiClient.get
      .mockResolvedValueOnce({ data: { content: [pricing] } })
      .mockResolvedValueOnce({ data: pricing })
      .mockResolvedValueOnce({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: pricing })
    apiClient.patch.mockResolvedValue({ data: pricing })
    apiClient.put
      .mockResolvedValueOnce({ data: pricing })
      .mockResolvedValueOnce({ data: [pricing] })

    await damageCodePricingService.getByDamageCodeId(damageCodeId, {
      page: 2,
      signal,
      size: 100,
    })
    await damageCodePricingService.getById(pricingId, signal)
    await damageCodePricingService.getPage({
      filters: { priceType: ['TOTAL'] },
      page: 1,
      signal,
      size: 40,
    })
    await damageCodePricingService.create({
      amount: 10,
      damageCodeId,
      priceType: 'TOTAL',
    })
    await damageCodePricingService.update(pricingId, {
      amount: 10,
      damageCodeId,
      priceType: 'TOTAL',
    })
    await damageCodePricingService.delete(pricingId)
    await damageCodePricingService.softDelete(pricingId, '2026-12-31')
    await damageCodePricingService.softDeleteBulk([pricingId], '2026-12-31')
    await damageCodePricingService.bulkDelete([pricingId])

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/damage-code-pricings/page',
      {
        params: { damageCodeId, page: 2, size: 100 },
        signal,
      }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      `/damage-code-pricings/${pricingId}`,
      {
        signal,
      }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      3,
      '/damage-code-pricings/page-full',
      {
        params: { page: 1, priceType__in: 'TOTAL', size: 40 },
        signal,
      }
    )
    expect(apiClient.post).toHaveBeenCalledWith('/damage-code-pricings', {
      amount: 10,
      damageCodeId,
      priceType: 'TOTAL',
    })
    expect(apiClient.patch).toHaveBeenCalledWith(
      `/damage-code-pricings/${pricingId}`,
      {
        amount: 10,
        damageCodeId,
        id: pricingId,
        priceType: 'TOTAL',
      }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      1,
      `/damage-code-pricings/${pricingId}`
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      `/damage-code-pricings/soft-delete/${pricingId}`,
      null,
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/damage-code-pricings/soft-delete',
      [pricingId],
      { params: { thruDate: '2026-12-31' } }
    )
    expect(apiClient.delete).toHaveBeenNthCalledWith(
      2,
      '/damage-code-pricings/bulk-delete',
      {
        data: [pricingId],
      }
    )
  })

  it('validates IDs and bulk request bodies before transport', async () => {
    await expect(
      damageCodePricingService.getById('not-a-uuid')
    ).rejects.toThrow()
    await expect(damageCodePricingService.softDeleteBulk([])).rejects.toThrow()
    await expect(damageCodePricingService.bulkDelete([])).rejects.toThrow()

    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
    expect(apiClient.delete).not.toHaveBeenCalled()
  })
})
