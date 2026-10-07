import { ticketService } from '@features/tickets/services/ticket-service'
import type { FindSupportTicketsRequest } from '@iap/api-types'
import { queryOptions } from '@tanstack/react-query'

export const ticketDetailQueryKey = (ticketId: string | null) =>
  ['tickets', ticketId] as const

export function ticketPageQueryOptions(request: FindSupportTicketsRequest) {
  const { page = 0, size = 30, filters } = request.query
  return queryOptions({
    queryKey: ['tickets', { pageIndex: page, pageSize: size }, filters],
    queryFn: ({ signal }) => ticketService.getPageFull(request, { signal }),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })
}

export function ticketDetailQueryOptions(
  ticketId: string | null,
  isOpen: boolean
) {
  return queryOptions({
    queryKey: ticketDetailQueryKey(ticketId),
    queryFn: ({ signal }) =>
      ticketService.getById({ path: { id: ticketId! } }, { signal }),
    enabled: isOpen && Boolean(ticketId),
  })
}

export function ticketMessagesQueryOptions(
  ticketId: string | null,
  isOpen: boolean
) {
  return queryOptions({
    queryKey: ['ticketMessages', ticketId],
    queryFn: ({ signal }) =>
      ticketService.getMessages(
        { path: { ticketId: ticketId! }, query: { size: 100 } },
        { signal }
      ),
    enabled: isOpen && Boolean(ticketId),
  })
}
