import { beforeEach, describe, expect, it, vi } from 'vitest'

import { coverageDamageCodeApplService } from './coverage-damage-code-appl-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('coverageDamageCodeApplService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference /page-full endpoint with the selected coverage filter', async () => {
    const coverageDetailId = '550e8400-e29b-41d4-a716-446655440000'
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({ data: { content: [] } })

    await expect(
      coverageDamageCodeApplService.getPage({
        filters: { coverageDetailId },
        page: 1,
        signal,
        size: 20,
      })
    ).resolves.toMatchObject({ content: [] })

    expect(apiClient.get).toHaveBeenCalledWith(
      '/coverage-damage-code-appls/page-full',
      {
        params: { coverageDetailId, page: 1, size: 20 },
        signal,
      }
    )
  })

  it('forwards the reference optional sort parameters', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })

    await coverageDamageCodeApplService.getPage({
      direction: 'DESC',
      page: 0,
      size: 20,
      sort: 'priority',
    })

    expect(apiClient.get).toHaveBeenCalledWith(
      '/coverage-damage-code-appls/page-full',
      {
        params: { direction: 'DESC', page: 0, size: 20, sort: 'priority' },
        signal: undefined,
      }
    )
  })

  it('keeps the reference single delete and soft-delete endpoints', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    const thruDate = new Date('2026-01-02T03:04:05.000Z')
    apiClient.delete.mockResolvedValue({})
    apiClient.put.mockResolvedValue({ data: { id } })

    await coverageDamageCodeApplService.delete(id)
    await coverageDamageCodeApplService.softDelete(id, thruDate)

    expect(apiClient.delete).toHaveBeenCalledWith(
      `/coverage-damage-code-appls/${id}`
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      `/coverage-damage-code-appls/soft-delete/${id}`,
      null,
      { params: { thruDate: '2026-01-02T03:04:05.000Z' } }
    )
  })
})
