import {
  createPageResponseSchema,
  findMyIapTicketMessagesRequestSchema,
  findMyIapTicketsRequestSchema,
  supportFlowRequestSchema,
  supportFlowResponseSchema,
  supportOptionSchema,
  supportOptionsPageSchema,
} from '@iap/api-types'
import { supportService } from '@iap/support'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const client = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('@iap/api-client', () => ({ getApiClient: () => client }))
const ticketId = '123e4567-e89b-42d3-a456-426614174000'

describe('Support reference contracts and transport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    client.post.mockResolvedValue({ data: {} })
    client.get.mockResolvedValue({ data: {} })
  })

  it('makes common page content nullish while validating every present item', () => {
    const schema = createPageResponseSchema(supportOptionSchema)
    expect(schema.parse({ totalElements: null })).toEqual({
      totalElements: null,
    })
    expect(schema.parse({ content: [] })).toEqual({ content: [] })
    expect(schema.safeParse({ content: null }).success).toBe(true)
    expect(schema.safeParse({ content: [{ amount: 'invalid' }] }).success).toBe(
      false
    )
  })

  it('keeps absent option content nullish and validates integer metadata and present items', () => {
    expect(supportOptionsPageSchema.parse({ extra: true })).toEqual({})
    expect(supportOptionsPageSchema.safeParse({ content: null }).success).toBe(
      true
    )
    expect(supportOptionsPageSchema.safeParse({ size: 1.5 }).success).toBe(
      false
    )
    expect(supportOptionsPageSchema.safeParse({ size: null }).success).toBe(
      false
    )
    expect(
      supportOptionsPageSchema.safeParse({ content: [{ businessKey: 1.5 }] })
        .success
    ).toBe(false)
    expect(
      supportOptionsPageSchema.parse({ pageable: { sort: { sorted: true } } })
    ).toEqual({ pageable: { sort: { sorted: true } } })
  })

  it('preserves object context and strips unknown request keys, rejecting unsupported scalar context', () => {
    expect(
      supportFlowRequestSchema.parse({
        parametersContext: {
          item: { id: 'x' },
          messages: ['a'],
          selected: 'x',
        },
        extra: true,
      })
    ).toEqual({
      parametersContext: { item: { id: 'x' }, messages: ['a'], selected: 'x' },
    })
    expect(
      supportFlowRequestSchema.safeParse({ parametersContext: { invalid: 4 } })
        .success
    ).toBe(false)
    expect(
      supportFlowResponseSchema.safeParse({
        response: { requiredParamInputDisplay: 'OTHER' },
      }).success
    ).toBe(false)
  })

  it('retains optional unrestricted integer pagination without defaults and requires string filters', () => {
    expect(
      findMyIapTicketMessagesRequestSchema.parse({
        path: { ticketId },
        query: {},
      })
    ).toEqual({ path: { ticketId }, query: {} })
    expect(
      findMyIapTicketsRequestSchema.parse({
        query: { page: -1, size: 0, filters: {} },
      })
    ).toEqual({ query: { page: -1, size: 0, filters: {} } })
    expect(findMyIapTicketsRequestSchema.safeParse({ query: {} }).success).toBe(
      false
    )
    expect(
      findMyIapTicketsRequestSchema.safeParse({
        query: { filters: { status: ['OPEN'] } },
      }).success
    ).toBe(false)
  })

  it('posts both answers with cancellation and public credentials', async () => {
    const signal = new AbortController().signal
    await supportService.publicAnswer({ pageKey: 'login' }, { signal })
    expect(client.post).toHaveBeenLastCalledWith(
      '/support/answer',
      { pageKey: 'login' },
      { signal, withCredentials: true }
    )
    await supportService.myAnswer({ pageKey: 'claims' }, { signal })
    expect(client.post).toHaveBeenLastCalledWith(
      '/support/my/answer',
      { pageKey: 'claims' },
      { signal }
    )
  })

  it('places My-IAP identifiers in paths and pagination/filter values in the query', async () => {
    const signal = new AbortController().signal
    await supportService.getMyIapTicketById({ path: { ticketId } }, { signal })
    expect(client.get).toHaveBeenLastCalledWith(
      `/my/iap-ticket/tickets/${ticketId}`,
      { signal }
    )
    await supportService.getMyIapTicketMessages(
      { path: { ticketId }, query: { page: 0, size: 10 } },
      { signal }
    )
    expect(client.get).toHaveBeenLastCalledWith(
      `/my/iap-ticket/tickets/${ticketId}/messages`,
      { params: { page: 0, size: 10 }, signal }
    )
    await supportService.getMyIapTickets(
      { query: { filters: { status: 'OPEN' } } },
      { signal }
    )
    expect(client.get).toHaveBeenLastCalledWith(
      '/my/iap-ticket/tickets/page-full',
      { params: { page: undefined, size: undefined, status: 'OPEN' }, signal }
    )
  })

  it('rejects malformed requests before transport and malformed responses after transport', async () => {
    await expect(
      supportService.getMyIapTicketById({ path: { ticketId: 'invalid' } })
    ).rejects.toThrow()
    expect(client.get).not.toHaveBeenCalled()
    client.post.mockResolvedValue({ data: { questionStack: [1] } })
    await expect(supportService.myAnswer({})).rejects.toThrow()
  })
})
