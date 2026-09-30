import { TicketProvider } from '@features/tickets/ui/ticket-provider'
import { TicketsContent } from '@features/tickets/ui/tickets-content'

export function TicketsPage() {
  return (
    <TicketProvider>
      <TicketsContent />
    </TicketProvider>
  )
}
