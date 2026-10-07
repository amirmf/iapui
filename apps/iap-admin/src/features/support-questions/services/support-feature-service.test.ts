import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { supportFeatureService } from './support-feature-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('supportFeatureService', () => {
  const mockGet = vi.fn()
  const mockPost = vi.fn()
  const mockPut = vi.fn()
  const mockDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getApiClient).mockReturnValue({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    } as never)
  })

  it('getPage requests /support/features/page with params', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 'feat-1',
            featureKey: 'export_csv',
            title: 'Export CSV',
            active: true,
            pageKeys: ['dashboard'],
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
    })

    const result = await supportFeatureService.getPage({
      page: 0,
      size: 10,
      filters: {},
      sort: 'createdAt',
      direction: 'DESC',
    })

    expect(mockGet).toHaveBeenCalledWith('/support/features/page', {
      params: {
        page: 0,
        size: 10,
        sort: 'createdAt',
        direction: 'DESC',
      },
      signal: undefined,
    })
    expect(result.content).toHaveLength(1)
    expect(result.content?.[0].featureKey).toBe('export_csv')
  })

  it('create sends post to /support/features and returns result', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        id: 'feat-2',
        featureKey: 'print_pdf',
        title: 'Print PDF',
        active: true,
        pageKeys: [],
      },
    })

    const result = await supportFeatureService.create({
      featureKey: 'print_pdf',
      title: 'Print PDF',
      active: true,
      pageKeys: [],
    })

    expect(mockPost).toHaveBeenCalledWith('/support/features', {
      featureKey: 'print_pdf',
      title: 'Print PDF',
      active: true,
      pageKeys: [],
    })
    expect(result.id).toBe('feat-2')
  })

  it('delete sends delete to /support/features/:id', async () => {
    mockDelete.mockResolvedValueOnce({ data: null })

    await supportFeatureService.delete('feat-1')

    expect(mockDelete).toHaveBeenCalledWith('/support/features/feat-1')
  })
})
