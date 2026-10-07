import type { TicketStatus } from '@iap/api-types'

export const ticketStatusColors: Record<TicketStatus, string> = {
  OPEN: 'border-blue-300 bg-blue-50 text-blue-700',
  ASSIGNED: 'border-purple-300 bg-purple-50 text-purple-700',
  WAITING_FOR_USER: 'border-amber-300 bg-amber-50 text-amber-700',
  WAITING_FOR_SUPPORT: 'border-orange-300 bg-orange-50 text-orange-700',
  ANSWERED: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  CLOSED: 'border-slate-300 bg-slate-50 text-slate-700',
}

export const TICKET_STATUS_TRANSLATION_KEYS = {
  OPEN: 'tickets.status.OPEN',
  ASSIGNED: 'tickets.status.ASSIGNED',
  WAITING_FOR_USER: 'tickets.status.WAITING_FOR_USER',
  WAITING_FOR_SUPPORT: 'tickets.status.WAITING_FOR_SUPPORT',
  ANSWERED: 'tickets.status.ANSWERED',
  CLOSED: 'tickets.status.CLOSED',
} as const satisfies Record<TicketStatus, `tickets.status.${string}`>
