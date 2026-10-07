import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  SupportTicketOwnershipError,
  isValidSupportTicketId,
  useRecentTickets,
  useTicketDetails,
} from './use-support-tickets'

const mocks = vi.hoisted(() => ({
  userId: '3a1e5a56-bdf8-4aab-9472-bd993fe9d5af',
  getMyIapTickets: vi.fn(),
  getMyIapTicketById: vi.fn(),
  getMyIapTicketMessages: vi.fn(),
  useQuery: vi.fn((options: unknown) => options),
  useInfiniteQuery: vi.fn((options: unknown) => options),
}))

vi.mock('@iap/auth', () => ({
  useAuthSession: () => ({ user: { id: mocks.userId } }),
}))
vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
  useInfiniteQuery: mocks.useInfiniteQuery,
}))
vi.mock('../services/support-service', () => ({ supportService: mocks }))

type QueryOptions = {
  enabled: boolean
  queryKey: readonly unknown[]
  queryFn: (context: { signal: AbortSignal }) => Promise<unknown>
  select: (page: unknown) => { content: unknown[] }
}

function getOptions() {
  return mocks.useQuery.mock.calls.at(-1)?.[0] as QueryOptions
}

const ticketId = '7d8bdf82-7545-4f59-9d4c-bb18004f6294'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.userId = '3a1e5a56-bdf8-4aab-9472-bd993fe9d5af'
})

describe('support ticket access boundaries', () => {
  it('rejects malformed identifiers before enabling the detail request', () => {
    expect(isValidSupportTicketId('invalid')).toBe(false)
    useTicketDetails('invalid')
    expect(getOptions().enabled).toBe(false)
    expect(isValidSupportTicketId(ticketId)).toBe(true)
  })

  it('never exposes another owner’s ticket and forwards cancellation', async () => {
    useTicketDetails(ticketId)
    const signal = new AbortController().signal
    mocks.getMyIapTicketById.mockResolvedValue({
      id: ticketId,
      ownerUserAccount: { id: 'someone-else' },
    })
    await expect(getOptions().queryFn({ signal })).rejects.toBeInstanceOf(
      SupportTicketOwnershipError
    )
    expect(mocks.getMyIapTicketById).toHaveBeenCalledWith(
      { path: { ticketId } },
      { signal }
    )
  })

  it('partitions caches by account and hides foreign recent tickets', () => {
    useRecentTickets()
    const first = getOptions()
    expect(first.select({})).toEqual({ content: [] })
    expect(first.select({ content: null })).toEqual({ content: [] })
    expect(
      first.select({
        content: [
          { id: 'foreign', ownerUserAccount: { id: 'someone-else' } },
          { id: 'owned', ownerUserAccount: { id: mocks.userId } },
        ],
      }).content
    ).toEqual([{ id: 'owned', ownerUserAccount: { id: mocks.userId } }])
    mocks.userId = 'a9dc3c88-8bf6-4b14-9984-40e8b3322085'
    useRecentTickets()
    expect(getOptions().queryKey).not.toEqual(first.queryKey)
  })

  it('preserves the recent list owner filter, sort, page size and cancellation', async () => {
    useRecentTickets()
    const signal = new AbortController().signal
    mocks.getMyIapTickets.mockResolvedValue({ content: null })
    await getOptions().queryFn({ signal })
    expect(mocks.getMyIapTickets).toHaveBeenCalledWith(
      {
        query: {
          page: 0,
          size: 2,
          filters: {
            ownerUserAccountId: mocks.userId,
            sort: 'createdAt',
            direction: 'desc',
          },
        },
      },
      { signal }
    )
  })
})
