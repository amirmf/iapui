import { TicketsPage } from '@features/tickets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tickets/')({
  component: TicketsPage,
})
