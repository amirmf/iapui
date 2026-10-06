import { getApiClient } from '@iap/api-client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { assignementRuleService } from './assignement-rule-service'

vi.mock('@iap/api-client', () => ({
  getApiClient: vi.fn(),
}))

describe('assignementRuleService', () => {
  const mockGet = vi.fn()
  const mockPost = vi.fn()
  const mockPut = vi.fn()
  const mockDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getApiClient).mockReturnValue({
      delete: mockDelete,
      get: mockGet,
      post: mockPost,
      put: mockPut,
    } as never)
  })

  it('calls getPage with page-full endpoint and transformed filters', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        content: [
          { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Rule 1' },
        ],
        totalElements: 1,
        totalPages: 1,
      },
    })

    const result = await assignementRuleService.getPage({
      filters: { title: 'Rule' },
      page: 1,
      size: 20,
    })

    expect(mockGet).toHaveBeenCalledWith('/assignement-rules/page-full', {
      params: {
        page: 1,
        size: 20,
        title: 'Rule',
      },
      signal: undefined,
    })
    expect(result.content).toHaveLength(1)
  })

  it('calls getById with correct id', async () => {
    mockGet.mockResolvedValueOnce({
      data: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Rule 1' },
    })

    const result = await assignementRuleService.getById(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    )
    expect(mockGet).toHaveBeenCalledWith(
      '/assignement-rules/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      { signal: undefined }
    )
    expect(result.id).toBe('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
  })

  it('calls create with ISO dates serialized', async () => {
    mockPost.mockResolvedValueOnce({
      data: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'New Rule' },
    })

    const fromDate = new Date('2026-01-01T10:00:00.000Z')
    await assignementRuleService.create({
      fromDate,
      status: 'ACTIVE',
      title: 'New Rule',
    })

    expect(mockPost).toHaveBeenCalledWith('/assignement-rules', {
      fromDate: fromDate.toISOString(),
      status: 'ACTIVE',
      thruDate: undefined,
      title: 'New Rule',
    })
  })

  it('calls update with id and ISO dates', async () => {
    mockPut.mockResolvedValueOnce({
      data: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Updated' },
    })

    await assignementRuleService.update(
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      {
        status: 'INACTIVE',
        title: 'Updated',
      }
    )

    expect(mockPut).toHaveBeenCalledWith(
      '/assignement-rules/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      {
        fromDate: undefined,
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        status: 'INACTIVE',
        thruDate: undefined,
        title: 'Updated',
      }
    )
  })

  it('calls delete with id', async () => {
    mockDelete.mockResolvedValueOnce({})

    await assignementRuleService.delete('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
    expect(mockDelete).toHaveBeenCalledWith(
      '/assignement-rules/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    )
  })

  it('calls bulkDelete with ids in body', async () => {
    mockDelete.mockResolvedValueOnce({})

    const ids = ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11']
    await assignementRuleService.bulkDelete(ids)
    expect(mockDelete).toHaveBeenCalledWith('/assignement-rules/bulk-delete', {
      data: ids,
    })
  })
})
