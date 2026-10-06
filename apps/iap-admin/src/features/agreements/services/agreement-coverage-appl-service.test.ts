import { beforeEach, describe, expect, it, vi } from 'vitest'

import { agreementCoverageApplService } from './agreement-coverage-appl-service'

const agreementId = '550e8400-e29b-41d4-a716-446655440000'
const coverageApplId = '550e8400-e29b-41d4-a716-446655440001'
const coverageId = '550e8400-e29b-41d4-a716-446655440002'
const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const coverageApplForm = {
  agreementId,
  amountPerCase: 25_000,
  coverageDetailId: coverageId,
  fromDate: new Date('2026-01-02T03:04:05.000Z'),
  thruDate: new Date('2026-12-31T00:00:00.000Z'),
}

describe('agreementCoverageApplService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses coverage-application endpoints and serializes form dates at the transport boundary', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post
      .mockResolvedValueOnce({ data: { id: coverageApplId } })
      .mockResolvedValueOnce({ data: undefined })
    apiClient.patch.mockResolvedValue({ data: { id: coverageApplId } })
    apiClient.put.mockResolvedValue({ data: [{ id: coverageApplId }] })

    await agreementCoverageApplService.getPage({
      filters: { agreementId, coverageDetailId: [coverageId] },
      page: 1,
      size: 10,
    })
    await agreementCoverageApplService.create(coverageApplForm)
    await agreementCoverageApplService.update(coverageApplId, coverageApplForm)
    await agreementCoverageApplService.initialize(agreementId)
    await agreementCoverageApplService.softDeleteBulk(
      [coverageApplId],
      '2027-01-01T00:00:00.000Z'
    )
    await agreementCoverageApplService.bulkDelete([coverageApplId])

    expect(apiClient.get).toHaveBeenCalledWith(
      '/agreement-coverage-appls/page-full',
      {
        params: {
          agreementId,
          coverageDetailId__in: coverageId,
          page: 1,
          size: 10,
        },
      }
    )
    const serializedForm = {
      ...coverageApplForm,
      fromDate: '2026-01-02T03:04:05.000Z',
      thruDate: '2026-12-31T00:00:00.000Z',
    }
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      '/agreement-coverage-appls',
      serializedForm
    )
    expect(apiClient.patch).toHaveBeenCalledWith(
      `/agreement-coverage-appls/${coverageApplId}`,
      { ...serializedForm, id: coverageApplId }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      '/agreement-coverage-appls/initialize',
      { agreementId }
    )
    expect(apiClient.put).toHaveBeenCalledWith(
      '/agreement-coverage-appls/soft-delete',
      [coverageApplId],
      { params: { thruDate: '2027-01-01T00:00:00.000Z' } }
    )
    expect(apiClient.delete).toHaveBeenCalledWith(
      '/agreement-coverage-appls/bulk-delete',
      { data: [coverageApplId] }
    )
  })

  it('rejects invalid coverage-application requests before transport', async () => {
    await expect(
      agreementCoverageApplService.softDelete('not-a-uuid')
    ).rejects.toThrow()
    await expect(
      agreementCoverageApplService.delete('not-a-uuid')
    ).rejects.toThrow()
    await expect(
      agreementCoverageApplService.create({
        ...coverageApplForm,
        agreementId: '',
      })
    ).rejects.toThrow()
    await expect(
      agreementCoverageApplService.update('not-a-uuid', coverageApplForm)
    ).rejects.toThrow()
    await expect(
      agreementCoverageApplService.initialize('not-a-uuid')
    ).rejects.toThrow()
    await expect(agreementCoverageApplService.bulkDelete([])).rejects.toThrow()

    expect(apiClient.delete).not.toHaveBeenCalled()
    expect(apiClient.patch).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
  })

  it('rejects invalid coverage-application responses', async () => {
    apiClient.get.mockResolvedValue({
      data: { content: [{ id: 'not-a-uuid' }] },
    })

    await expect(agreementCoverageApplService.getPage({})).rejects.toThrow()
  })

  it('serializes Date-based bulk soft deletion and preserves the empty query fallback', async () => {
    apiClient.put.mockResolvedValue({ data: [] })
    const date = new Date('2026-12-31T00:00:00Z')
    await agreementCoverageApplService.softDeleteBulk([coverageApplId], date)
    await agreementCoverageApplService.softDeleteBulk([coverageApplId])
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      '/agreement-coverage-appls/soft-delete',
      [coverageApplId],
      { params: { thruDate: date.toISOString() } }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/agreement-coverage-appls/soft-delete',
      [coverageApplId],
      { params: {} }
    )
  })
})
