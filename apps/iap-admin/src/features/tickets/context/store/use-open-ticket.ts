import { useCallback } from 'react'

import { useTicketStore } from '@features/tickets/context/store/ticket-store'
import { ticketDetailQueryKey } from '@features/tickets/queries/ticket-queries'
import type { SupportTicket } from '@iap/api-types'
import { useQueryClient } from '@tanstack/react-query'

export function useOpenTicket() {
  const queryClient = useQueryClient()
  const setCurrentTicketId = useTicketStore((state) => state.setCurrentTicketId)
  const setOpen = useTicketStore((state) => state.setOpen)

  return useCallback(
    (ticket: SupportTicket) => {
      const ticketId = ticket.id ?? null
      const queryKey = ticketDetailQueryKey(ticketId)
      // Match initialData: seed only a cache without data; retain fetched detail.
      if (queryClient.getQueryData(queryKey) === undefined)
        queryClient.setQueryData(queryKey, ticket)
      setCurrentTicketId(ticketId)
      setOpen('detail')
    },
    [queryClient, setCurrentTicketId, setOpen]
  )
}
