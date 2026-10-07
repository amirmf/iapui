import { ticketService } from '@features/tickets/services/ticket-service'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiClient = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('@iap/api-client', () => ({ getApiClient: () => apiClient }))

const ticketId = '550e8400-e29b-41d4-a716-446655440000'

describe('ticketService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the reference ticket endpoints and request placement', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })
    apiClient.post.mockResolvedValue({ data: {} })
    const signal = new AbortController().signal

    await ticketService.getPageFull(
      {
        query: {
          filters: { status: 'ASSIGNED', tags: ['urgent'] },
          page: 1,
          size: 30,
        },
      },
      { signal }
    )
    await ticketService.getById({ path: { id: ticketId } }, { signal })
    await ticketService.getMessages(
      {
        path: { ticketId },
        query: { page: 0, size: 100 },
      },
      { signal }
    )
    await ticketService.createMessage({
      body: { body: 'پیام' },
      path: { ticketId },
    })
    await ticketService.close({ path: { ticketId } })
    await ticketService.assignToLatestAssessmentUser({ path: { ticketId } })

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/support/tickets/page-full',
      {
        params: { page: 1, size: 30, status: 'ASSIGNED', tags__in: 'urgent' },
        signal,
      }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      `/support/tickets/${ticketId}`,
      { signal }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      3,
      `/support/tickets/${ticketId}/messages`,
      {
        params: { page: 0, size: 100 },
        signal,
      }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      `/support/tickets/${ticketId}/messages`,
      { body: 'پیام' }
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      `/support/tickets/${ticketId}/close`
    )
    expect(apiClient.post).toHaveBeenNthCalledWith(
      3,
      `/support/tickets/${ticketId}/assign_to_Latest_assessmentUser`
    )
  })

  it('rejects malformed path IDs before transport', async () => {
    await expect(
      ticketService.getById({ path: { id: 'invalid' } })
    ).rejects.toThrow()
    await expect(
      ticketService.createMessage({
        body: { body: 'x'.repeat(4001) },
        path: { ticketId },
      })
    ).rejects.toThrow()
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(apiClient.post).not.toHaveBeenCalled()
  })

  it('applies the reference defaults for omitted page requests', async () => {
    apiClient.get.mockResolvedValue({ data: { content: [] } })

    await ticketService.getPageFull({ query: { filters: {} } })
    await ticketService.getMessages({ path: { ticketId }, query: {} })

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/support/tickets/page-full',
      {
        params: { page: 0, size: 30 },
        signal: undefined,
      }
    )
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      `/support/tickets/${ticketId}/messages`,
      {
        params: { page: 0, size: 20 },
        signal: undefined,
      }
    )
  })
})
