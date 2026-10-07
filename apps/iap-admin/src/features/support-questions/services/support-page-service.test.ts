import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { supportPageService } from './support-page-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('supportPageService', () => {
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

  it('getPage requests /support/pages/page with params', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 'page-1',
            pageKey: 'dashboard',
            title: 'Dashboard Page',
            active: true,
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
    })

    const result = await supportPageService.getPage({
      page: 0,
      size: 10,
      filters: {},
      sort: 'createdAt',
      direction: 'ASC',
    })

    expect(mockGet).toHaveBeenCalledWith('/support/pages/page', {
      params: {
        page: 0,
        size: 10,
        sort: 'createdAt',
        direction: 'ASC',
      },
      signal: undefined,
    })
    expect(result.content).toHaveLength(1)
    expect(result.content?.[0].pageKey).toBe('dashboard')
  })

  it('create sends post to /support/pages and returns result', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        id: 'page-2',
        pageKey: 'claims',
        title: 'Claims Page',
        active: true,
      },
    })

    const result = await supportPageService.create({
      pageKey: 'claims',
      title: 'Claims Page',
      active: true,
    })

    expect(mockPost).toHaveBeenCalledWith('/support/pages', {
      pageKey: 'claims',
      title: 'Claims Page',
      active: true,
    })
    expect(result.id).toBe('page-2')
  })

  it('delete sends delete to /support/pages/:id', async () => {
    mockDelete.mockResolvedValueOnce({ data: null })

    await supportPageService.delete('page-1')

    expect(mockDelete).toHaveBeenCalledWith('/support/pages/page-1')
  })
})
