import { beforeEach, describe, expect, it, vi } from 'vitest'

import { assessmentItemService } from './assessment-item-editing-service'
import { claimPaymentService } from './claim-payment-service'

const client = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn(),
}))
vi.mock('@iap/api-client', () => ({ getApiClient: () => client }))
beforeEach(() => vi.clearAllMocks())
describe('assessment editing transport', () => {
  it('sends calculation JSON to source endpoint and rejects unknown request fields', async () => {
    client.post.mockResolvedValue({
      data: { payAmount: 50, overrideInsuredPersonId: null },
    })
    const request = {
      claimRequestId: 'claim',
      damageCode: 'code',
      amount: 100,
      amountItem: 100,
      quantity: 1,
    }
    await expect(claimPaymentService.calculate(request)).resolves.toMatchObject(
      { payAmount: 50 }
    )
    expect(client.post).toHaveBeenCalledWith(
      '/claim-payments/calculate',
      request
    )
    await expect(
      claimPaymentService.calculate({
        ...request,
        unknown: true,
      } as typeof request)
    ).rejects.toThrow()
    expect(client.post).toHaveBeenCalledTimes(1)
  })
  it('keeps case-sensitive franchise query names and validates the response', async () => {
    const request = {
      policyId: 1,
      healthPolicyInsuredPersonId: '2',
      IllnessId: 3,
      ReceptionDate: '2026-01-01',
    }
    client.get.mockResolvedValue({
      data: { Franchise: 20, extra: 'preserved' },
    })
    await expect(
      assessmentItemService.fetchExternalFranchiseAmount(request)
    ).resolves.toEqual({ Franchise: 20, extra: 'preserved' })
    expect(client.get).toHaveBeenCalledWith('/external-franchise-amounts', {
      params: request,
    })
    client.get.mockResolvedValue({ data: { Franchise: 'invalid' } })
    await expect(
      assessmentItemService.fetchExternalFranchiseAmount(request)
    ).rejects.toThrow()
  })
  it('sends preauthorizations pagination as query parameters with cancellation', async () => {
    const signal = new AbortController().signal
    const request = { policyId: 1, nationalCode: '123', page: 0, size: 20 }
    client.get.mockResolvedValue({
      data: { content: [{ id: 2, amount: 50 }], totalPages: null },
    })
    await expect(
      assessmentItemService.getPreAuths(request, signal)
    ).resolves.toMatchObject({ content: [{ id: 2 }], totalPages: null })
    expect(client.get).toHaveBeenCalledWith(
      '/claim-requests/pre-auths/page-full',
      { params: request, signal }
    )
    await expect(
      assessmentItemService.getPreAuths({ ...request, size: 0 }, signal)
    ).rejects.toThrow()
  })
  it('updates assessments using PUT body id and validates returned item', async () => {
    client.put.mockResolvedValue({ data: { id: 'item', amount: 5 } })
    await assessmentItemService.update('item', { amount: 5 })
    expect(client.put).toHaveBeenCalledWith('/assessment-items/item', {
      id: 'item',
      amount: 5,
    })
    await expect(
      assessmentItemService.update('item', { amount: 'bad' } as never)
    ).rejects.toThrow()
  })
})
