import { beforeEach, describe, expect, it, vi } from 'vitest'

import { agreementSelectionService } from './agreement-selection-service'

const apiClient = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const id = '550e8400-e29b-41d4-a716-446655440000'

describe('agreementSelectionService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects an invalid id before requesting an agreement', async () => {
    await expect(agreementSelectionService.getById('invalid')).rejects.toThrow()

    expect(apiClient.get).not.toHaveBeenCalled()
  })

  it('uses the reference agreement-page search contract', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        content: [{ code: 'AG-1', id, title: 'Agreement' }],
        totalElements: 1,
        totalPages: 1,
        size: 20,
        number: 0,
        first: true,
        last: true,
        numberOfElements: 1,
        empty: false,
      },
    })

    await agreementSelectionService.getPage({ title: '  Agreement  ' })

    expect(apiClient.get).toHaveBeenCalledWith('/agreements/page', {
      params: { page: 0, size: 20, title: '  Agreement  ' },
      signal: undefined,
    })
  })

  it('uses the reference detail path', async () => {
    apiClient.get.mockResolvedValue({ data: { id, title: 'Agreement' } })

    await agreementSelectionService.getById(id)

    expect(apiClient.get).toHaveBeenCalledWith(`/agreements/${id}`, {
      signal: undefined,
    })
  })

  it.each([
    { status: 'UNKNOWN' },
    { fromDate: '2026-02-30T00:00:00Z' },
    { extPolicyId: 1.5 },
  ])('rejects invalid source-backed agreement fields: %j', async (invalid) => {
    apiClient.get.mockResolvedValue({ data: { id, ...invalid } })
    await expect(agreementSelectionService.getById(id)).rejects.toThrow()
  })
})
