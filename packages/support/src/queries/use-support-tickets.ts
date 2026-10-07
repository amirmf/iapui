import { useEffect, useMemo } from 'react'

import {
  type PageSupportTicket,
  type PageSupportTicketMessage,
  type SupportTicket,
  type SupportTicketMessage,
} from '@iap/api-types'
import { useAuthSession } from '@iap/auth'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { supportService } from '../services/support-service'

const RECENT_TICKET_COUNT = 2
const TICKET_PAGE_SIZE = 20
const TICKET_MESSAGE_PAGE_SIZE = 100

const supportTicketQueryKeys = {
  all: ['support', 'my-tickets'] as const,
  recent: (userId: string | null) =>
    [...supportTicketQueryKeys.all, 'recent-answered', userId] as const,
  infinite: (userId: string | null) =>
    [...supportTicketQueryKeys.all, 'infinite', userId] as const,
  detail: (userId: string | null, ticketId: string | null) =>
    [...supportTicketQueryKeys.all, 'detail', userId, ticketId] as const,
  messages: (userId: string | null, ticketId: string | null) =>
    [...supportTicketQueryKeys.all, 'messages', userId, ticketId] as const,
}

export class SupportTicketOwnershipError extends Error {
  constructor() {
    super('Ticket does not belong to the current user')
    this.name = 'SupportTicketOwnershipError'
  }
}

export function useRecentTickets() {
  const { user } = useAuthSession()
  const userId = user?.id ?? null

  return useQuery({
    queryKey: supportTicketQueryKeys.recent(userId),
    queryFn: ({ signal }) =>
      getMyTicketsPage({
        userId: userId ?? '',
        page: 0,
        size: RECENT_TICKET_COUNT,
        signal,
      }),
    enabled: Boolean(userId),
    select: (page) => ({
      ...page,
      content: getOwnedTickets(page, userId).slice(0, RECENT_TICKET_COUNT),
    }),
  })
}

export function useInfiniteMyTickets() {
  const { user } = useAuthSession()
  const userId = user?.id ?? null
  const query = useInfiniteQuery({
    queryKey: supportTicketQueryKeys.infinite(userId),
    queryFn: ({ pageParam, signal }) =>
      getMyTicketsPage({
        userId: userId ?? '',
        page: pageParam,
        size: TICKET_PAGE_SIZE,
        signal,
      }),
    enabled: Boolean(userId),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
  })

  const tickets = useMemo(
    () => deduplicateTickets(query.data?.pages ?? [], userId),
    [query.data?.pages, userId]
  )

  return {
    data: query.data,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isError: query.isError,
    isFetchNextPageError: query.isFetchNextPageError,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    refetch: query.refetch,
    tickets,
    userId,
  }
}

export function useTicketDetails(ticketId: string | null) {
  const { user } = useAuthSession()
  const userId = user?.id ?? null
  const validTicketId = getValidTicketId(ticketId)

  return useQuery({
    queryKey: supportTicketQueryKeys.detail(userId, validTicketId),
    queryFn: async ({ signal }) => {
      const ticket = await supportService.getMyIapTicketById(
        { path: { ticketId: validTicketId ?? '' } },
        { signal }
      )

      if (ticket.ownerUserAccount?.id !== userId) {
        throw new SupportTicketOwnershipError()
      }

      return ticket
    },
    enabled: Boolean(userId && validTicketId),
    retry: false,
  })
}

export function useTicketMessages(
  ticketId: string | null,
  ownershipConfirmed: boolean
) {
  const { user } = useAuthSession()
  const userId = user?.id ?? null
  const validTicketId = getValidTicketId(ticketId)
  const query = useInfiniteQuery({
    queryKey: supportTicketQueryKeys.messages(userId, validTicketId),
    queryFn: ({ pageParam, signal }) =>
      supportService.getMyIapTicketMessages(
        {
          path: { ticketId: validTicketId ?? '' },
          query: { page: pageParam, size: TICKET_MESSAGE_PAGE_SIZE },
        },
        { signal }
      ),
    enabled: Boolean(userId && validTicketId && ownershipConfirmed),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
  })
  const {
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  } = query

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchNextPageError, isFetchingNextPage])

  const messages = useMemo(
    () => deduplicateAndSortMessages(query.data?.pages ?? []),
    [query.data?.pages]
  )

  return {
    data: query.data,
    error: query.error,
    fetchNextPage,
    hasNextPage,
    isError: query.isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading: query.isLoading,
    messages,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}

export function isValidSupportTicketId(ticketId: string | null) {
  return Boolean(getValidTicketId(ticketId))
}

function getMyTicketsPage(props: {
  userId: string
  page: number
  size: number
  status?: 'ANSWERED'
  signal?: AbortSignal
}) {
  const { userId, page, size, status, signal } = props
  return supportService.getMyIapTickets(
    {
      query: {
        page,
        size,
        filters: {
          ownerUserAccountId: userId,
          ...(status ? { status } : {}),
          sort: 'createdAt',
          direction: 'desc',
        },
      },
    },
    { signal }
  )
}

function getNextPageNumber(page: PageSupportTicket | PageSupportTicketMessage) {
  if (page.last === true) return undefined
  if (page.number == null) return undefined
  if ((page.content?.length ?? 0) === 0) return undefined

  const nextPage = page.number + 1

  if (page.totalPages != null && nextPage >= page.totalPages) {
    return undefined
  }

  if (page.size != null && (page.content?.length ?? 0) < page.size) {
    return undefined
  }

  return nextPage
}

function getOwnedTickets(page: PageSupportTicket, userId: string | null) {
  if (!userId) return []
  return (page.content ?? []).filter(
    (ticket) => ticket.ownerUserAccount?.id === userId
  )
}

function deduplicateTickets(pages: PageSupportTicket[], userId: string | null) {
  const ticketsById = new Map<string, SupportTicket>()

  for (const page of pages) {
    for (const ticket of getOwnedTickets(page, userId)) {
      if (ticket.id) ticketsById.set(ticket.id, ticket)
    }
  }

  return Array.from(ticketsById.values())
}

function deduplicateAndSortMessages(pages: PageSupportTicketMessage[]) {
  const messagesById = new Map<string, SupportTicketMessage>()
  const messagesWithoutId: SupportTicketMessage[] = []

  for (const page of pages) {
    for (const message of page.content ?? []) {
      if (message.id) messagesById.set(message.id, message)
      else messagesWithoutId.push(message)
    }
  }

  return [...Array.from(messagesById.values()), ...messagesWithoutId].sort(
    (first, second) =>
      getTimestamp(first.createdAt) - getTimestamp(second.createdAt)
  )
}

function getTimestamp(value: string | null | undefined) {
  if (!value) return 0
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function getValidTicketId(ticketId: string | null) {
  return z.uuid().safeParse(ticketId).success ? ticketId : null
}
