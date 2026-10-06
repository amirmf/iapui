import { beforeEach, describe, expect, it, vi } from 'vitest'

import { agreementService } from './agreement-service'

const agreementId = '550e8400-e29b-41d4-a716-446655440000'
const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const agreementForm = {
  code: 'AGR-1405',
  extContractId: '12',
  extPlanId: '34',
  extPolicyId: '56',
  fromDate: new Date('2026-01-02T03:04:05.000Z'),
  overrideRatio: '0.25',
  status: 'ACTIVE' as const,
  thruDate: new Date('2026-12-31T00:00:00.000Z'),
  title: 'قرارداد درمان',
}

describe('agreementService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the agreement endpoints with the verified query and body placement', async () => {
    const signal = new AbortController().signal
    const thruDate = '2027-01-01T00:00:00.000Z'
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: { id: agreementId } })
    apiClient.put
      .mockResolvedValueOnce({ data: { id: agreementId } })
      .mockResolvedValueOnce({ data: [{ id: agreementId }] })

    await agreementService.getPage({
      filters: { status: ['ACTIVE', 'DRAFT'], title: 'درمان' },
      page: 2,
      signal,
      size: 40,
    })
    await agreementService.create(agreementForm)
    await agreementService.update(agreementId, agreementForm)
    await agreementService.softDeleteBulk([agreementId], thruDate)
    await agreementService.bulkDelete([agreementId])

    expect(apiClient.get).toHaveBeenCalledWith('/agreements/page', {
      params: {
        page: 2,
        size: 40,
        status__in: 'ACTIVE,DRAFT',
        title: 'درمان',
      },
      signal,
    })
    expect(apiClient.post).toHaveBeenCalledWith('/agreements', {
      ...agreementForm,
      extContractId: 12,
      extPlanId: 34,
      extPolicyId: 56,
      fromDate: '2026-01-02T03:04:05.000Z',
      overrideRatio: 0.25,
      templateCode: undefined,
      extLocation: undefined,
      thruDate: '2026-12-31T00:00:00.000Z',
    })
    expect(apiClient.put).toHaveBeenNthCalledWith(
      1,
      `/agreements/${agreementId}`,
      {
        ...agreementForm,
        extContractId: 12,
        extPlanId: 34,
        extPolicyId: 56,
        fromDate: '2026-01-02T03:04:05.000Z',
        overrideRatio: 0.25,
        templateCode: undefined,
        extLocation: undefined,
        id: agreementId,
        thruDate: '2026-12-31T00:00:00.000Z',
      }
    )
    expect(apiClient.put).toHaveBeenNthCalledWith(
      2,
      '/agreements/soft-delete',
      [agreementId],
      { params: { thruDate: '2027-01-01T00:00:00.000Z' } }
    )
    expect(apiClient.delete).toHaveBeenCalledWith('/agreements/bulk-delete', {
      data: [agreementId],
    })
  })

  it('rejects invalid requests before transport', async () => {
    await expect(agreementService.getById('not-a-uuid')).rejects.toThrow()
    await expect(agreementService.softDelete('not-a-uuid')).rejects.toThrow()
    await expect(agreementService.delete('not-a-uuid')).rejects.toThrow()
    await expect(
      agreementService.create({ ...agreementForm, code: '' })
    ).rejects.toThrow()
    await expect(
      agreementService.update('not-a-uuid', agreementForm)
    ).rejects.toThrow()
    await expect(agreementService.getPage({ page: -1 })).rejects.toThrow()
    await expect(agreementService.bulkDelete([])).rejects.toThrow()

    expect(apiClient.delete).not.toHaveBeenCalled()
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
    expect(apiClient.put).not.toHaveBeenCalled()
  })

  it('rejects invalid agreement responses', async () => {
    apiClient.get.mockResolvedValue({
      data: { content: [{ id: 'not-a-uuid' }] },
    })

    await expect(agreementService.getPage({})).rejects.toThrow()
  })

  it('uses reference pagination defaults and normalizes optional fields before sending', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: { id: agreementId } })
    await agreementService.getPage({})
    expect(apiClient.get).toHaveBeenCalledWith('/agreements/page', {
      params: { page: 0, size: 30 },
      signal: undefined,
    })
    await agreementService.create({
      ...agreementForm,
      templateCode: ' TEMP ',
      extLocation: ' location ',
      extContractId: 'not numeric',
      extPlanId: '',
    })
    expect(apiClient.post).toHaveBeenCalledWith(
      '/agreements',
      expect.objectContaining({
        templateCode: 'TEMP',
        extLocation: 'location',
        extContractId: undefined,
        extPlanId: undefined,
      })
    )
  })
})
