import { beforeEach, describe, expect, it, vi } from 'vitest'

import { personSpecialDiseaseService } from './person-special-disease-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))
vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('personSpecialDiseaseService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the omitted reference endpoints with validated response parsing', async () => {
    apiClient.get
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({
        data: {
          content: [],
          number: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
        },
      })
    apiClient.put.mockResolvedValue({ data: [] })
    await personSpecialDiseaseService.getById('disease-1')
    await personSpecialDiseaseService.getPage({
      filters: {},
      page: 0,
      size: 20,
    })
    await personSpecialDiseaseService.delete('disease-1')
    await personSpecialDiseaseService.bulkDelete(['disease-1'])
    await personSpecialDiseaseService.softDelete(['disease-1'], '2026-01-01')
    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/person-special-diseases/disease-1',
      { signal: undefined }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      '/person-special-diseases/page',
      {
        params: { direction: undefined, page: 0, size: 20, sort: undefined },
        signal: undefined,
      }
    )
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/person-special-diseases/disease-1'
    )
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/person-special-diseases/bulk-delete',
      { data: ['disease-1'] }
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/person-special-diseases/soft-delete',
      ['disease-1'],
      { params: { thruDate: '2026-01-01' } }
    )
  })
})
