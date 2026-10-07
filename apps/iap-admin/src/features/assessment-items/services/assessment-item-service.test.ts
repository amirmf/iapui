import { beforeEach, describe, expect, it, vi } from 'vitest'

import { assessmentItemService } from './assessment-item-service'

const apiClient = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('assessmentItemService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the source read-only assessment-items endpoint and validates its list', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({
      data: [
        {
          amount: 120_000,
          damageCode: { code: 'D-1', title: 'ویزیت' },
          id: 'assessment-item-1',
          quantity: 1,
        },
      ],
    })

    await expect(
      assessmentItemService.findByClaimRequest({
        path: { claimRequestId: 'claim-request-1' },
        signal,
      })
    ).resolves.toHaveLength(1)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/assessment-items/claim-request/claim-request-1',
      { signal }
    )
  })

  it('posts the exact calculation request and validates returned damage cases', async () => {
    const payload = { claimRequestId: 'claim-1', assessmentItemId: 'item-1' }
    apiClient.post.mockResolvedValue({
      data: [{ totalAmount: 100, wsStatus: 'DONE', extra: 'retained' }],
    })
    await expect(
      assessmentItemService.getAfterCalculationResult(payload)
    ).resolves.toEqual([
      { totalAmount: 100, wsStatus: 'DONE', extra: 'retained' },
    ])
    expect(apiClient.post).toHaveBeenCalledWith(
      '/claim-requests/get-after-calculation-result',
      payload
    )
    apiClient.post.mockResolvedValue({ data: [{ wsStatus: 'INVALID' }] })
    await expect(
      assessmentItemService.getAfterCalculationResult(payload)
    ).rejects.toThrow()
  })

  it('rejects an empty claim request ID before transport', async () => {
    await expect(
      assessmentItemService.findByClaimRequest({
        path: { claimRequestId: '   ' },
      })
    ).rejects.toThrow()

    expect(apiClient.get).not.toHaveBeenCalled()
  })
})
