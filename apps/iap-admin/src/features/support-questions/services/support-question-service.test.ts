import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { supportQuestionService } from './support-question-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('supportQuestionService', () => {
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

  it('getPage requests correct URL with transformed filters', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 'q-1',
            questionKey: 'q_key_1',
            title: 'Title 1',
            active: true,
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
    })

    const result = await supportQuestionService.getPage({
      page: 0,
      size: 10,
      filters: { title__like: 'test' },
      sort: 'createdAt',
      direction: 'DESC',
    })

    expect(mockGet).toHaveBeenCalledWith('/support/questions/page', {
      params: {
        page: 0,
        size: 10,
        sort: 'createdAt',
        direction: 'DESC',
        title__like: 'test',
      },
      signal: undefined,
    })
    expect(result.content).toHaveLength(1)
    expect(result.content?.[0].questionKey).toBe('q_key_1')
  })

  it('create sends post and returns parsed question', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        id: 'q-2',
        questionKey: 'q_new',
        title: 'New Question',
        active: true,
      },
    })

    const result = await supportQuestionService.create({
      questionKey: 'q_new',
      title: 'New Question',
      active: true,
    })

    expect(mockPost).toHaveBeenCalledWith('/support/questions', {
      questionKey: 'q_new',
      title: 'New Question',
      active: true,
    })
    expect(result.id).toBe('q-2')
  })

  it('bulkDelete sends delete to bulk-delete endpoint', async () => {
    mockDelete.mockResolvedValueOnce({ data: null })

    await supportQuestionService.bulkDelete(['id-1', 'id-2'])

    expect(mockDelete).toHaveBeenCalledWith('/support/questions/bulk-delete', {
      data: ['id-1', 'id-2'],
    })
  })
})
