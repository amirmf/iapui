import { ticketService } from '@features/tickets/services/ticket-service'
import { mutationOptions } from '@tanstack/react-query'

export function createTicketMessageMutationOptions(
  ticketId: string | null,
  body: string
) {
  return mutationOptions({
    mutationFn: () =>
      ticketService.createMessage({
        path: { ticketId: ticketId! },
        body: { body },
      }),
  })
}

export function closeTicketMutationOptions(ticketId: string | null) {
  return mutationOptions({
    mutationFn: () => ticketService.close({ path: { ticketId: ticketId! } }),
  })
}
