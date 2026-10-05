import { TicketsContent } from '@features/tickets/components/tickets-content'
import { TicketProvider } from '@features/tickets/context/provider/ticket-provider'

export function TicketsPage() {
  return (
    <TicketProvider>
      <TicketsContent />
    </TicketProvider>
  )
}
