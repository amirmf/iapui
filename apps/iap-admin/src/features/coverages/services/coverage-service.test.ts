import { beforeEach, describe, expect, it, vi } from 'vitest'

import { coverageService } from './coverage-service'

const apiClient = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

describe('coverageService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference /coverages/page endpoint and validates its page', async () => {
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({ data: { content: [] } })

    await expect(
      coverageService.getPage({
        direction: 'ASC',
        filters: { coverageType: 'GROUP', title: 'درمان' },
        page: 2,
        signal,
        size: 10,
        sort: 'title',
      })
    ).resolves.toMatchObject({ content: [] })

    expect(apiClient.get).toHaveBeenCalledWith('/coverages/page', {
      params: {
        coverageType: 'GROUP',
        direction: 'ASC',
        page: 2,
        size: 10,
        sort: 'title',
        title: 'درمان',
      },
      signal,
    })
  })

  it('keeps the reference bulk soft-delete API name and serializes Date inputs', async () => {
    const thruDate = new Date('2026-01-02T03:04:05.000Z')
    apiClient.put.mockResolvedValue({ data: [] })

    await expect(
      coverageService.softDeleteBulk(
        ['550e8400-e29b-41d4-a716-446655440000'],
        thruDate
      )
    ).resolves.toEqual([])

    expect(apiClient.put).toHaveBeenCalledWith(
      '/coverages/soft-delete',
      ['550e8400-e29b-41d4-a716-446655440000'],
      { params: { thruDate: '2026-01-02T03:04:05.000Z' } }
    )
  })

  it('keeps the reference getById options-object signal contract', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000'
    const signal = new AbortController().signal
    apiClient.get.mockResolvedValue({ data: { id } })

    await coverageService.getById(id, { signal })

    expect(apiClient.get).toHaveBeenCalledWith(`/coverages/${id}`, { signal })
  })
})
