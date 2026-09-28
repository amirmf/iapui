import { beforeEach, describe, expect, it, vi } from 'vitest'

import { partyService } from './party-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const id = '550e8400-e29b-41d4-a716-446655440000'

describe('partyService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses reference CRUD methods without injecting an ID', async () => {
    apiClient.post.mockResolvedValue({ data: {} })
    apiClient.put.mockResolvedValue({ data: {} })
    await partyService.create({ identifier: 'party-1' })
    await partyService.update(id, { identifier: 'party-1' })
    expect(apiClient.post).toHaveBeenCalledWith('/parties', {
      identifier: 'party-1',
    })
    expect(apiClient.put).toHaveBeenCalledWith(`/parties/${id}`, {
      identifier: 'party-1',
    })
    expect(apiClient.patch).not.toHaveBeenCalled()
  })

  it('validates IDs and bulk actions before transport', async () => {
    await expect(partyService.delete('not-a-uuid')).rejects.toThrow()
    await expect(partyService.bulkDelete(['not-a-uuid'])).rejects.toThrow()
    expect(apiClient.delete).not.toHaveBeenCalled()
  })

  it('forwards page inputs and flattened filters', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    await partyService.getPage({
      direction: 'ASC',
      filters: { status: 'ACTIVE' },
      page: 2,
      signal,
      size: 10,
      sort: 'fullName',
    })
    expect(apiClient.get).toHaveBeenCalledWith('/parties/page', {
      params: {
        direction: 'ASC',
        page: 2,
        size: 10,
        sort: 'fullName',
        status: 'ACTIVE',
      },
      signal,
    })
  })
})
