import { memo } from 'react'

import { type SupportTicket, type TicketStatus } from '@iap/api-types'
import { cn } from '@iap/ui'
import { formatDateTime } from '@iap/ui'
import { Badge } from '@iap/ui'
import { ChevronRight, Clock3, Ticket } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  TICKET_STATUS_TRANSLATION_KEYS,
  ticketStatusColors,
} from '../../model/ticket-status'

const TICKET_STATUS_BORDER_CLASSES: Record<TicketStatus, string> = {
  OPEN: 'border-blue-300 border-s-blue-500 hover:border-blue-400 dark:border-blue-400/30 dark:border-s-blue-400 dark:hover:border-blue-400/50',
  ASSIGNED:
    'border-purple-300 border-s-purple-500 hover:border-purple-400 dark:border-purple-400/30 dark:border-s-purple-400 dark:hover:border-purple-400/50',
  WAITING_FOR_USER:
    'border-amber-300 border-s-amber-500 hover:border-amber-400 dark:border-amber-400/30 dark:border-s-amber-400 dark:hover:border-amber-400/50',
  WAITING_FOR_SUPPORT:
    'border-orange-300 border-s-orange-500 hover:border-orange-400 dark:border-orange-400/30 dark:border-s-orange-400 dark:hover:border-orange-400/50',
  ANSWERED:
    'border-emerald-300 border-s-emerald-500 hover:border-emerald-400 dark:border-emerald-400/30 dark:border-s-emerald-400 dark:hover:border-emerald-400/50',
  CLOSED:
    'border-slate-300 border-s-slate-500 hover:border-slate-400 dark:border-slate-400/30 dark:border-s-slate-400 dark:hover:border-slate-400/50',
}

type SupportTicketItemProps = {
  ticket: SupportTicket
  onSelect: (ticketId: string) => void
}

export const SupportTicketItem = memo(function SupportTicketItem(
  props: SupportTicketItemProps
) {
  const { ticket, onSelect } = props
  const { t, i18n } = useTranslation()
  const ticketId = ticket.id ?? null
  const date = ticket.updatedAt ?? ticket.createdAt

  return (
    <button
      type='button'
      className={cn(
        'group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-s-2 border-slate-200/80 border-s-indigo-500 bg-white/90 px-2 py-1.5 text-start shadow-sm transition-colors duration-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:border-s-indigo-400 dark:bg-white/[0.06] dark:hover:bg-white/[0.09] dark:focus-visible:ring-indigo-300',
        ticket.status && TICKET_STATUS_BORDER_CLASSES[ticket.status]
      )}
      disabled={!ticketId}
      onClick={() => ticketId && onSelect(ticketId)}
      aria-label={t('supportFlow.tickets.openTicket', {
        number: ticket.ticketNumber ?? '',
      })}
    >
      <span className='flex w-full min-w-0 items-center gap-2'>
        <span className='flex min-w-0 flex-1 items-center gap-2'>
          <Ticket
            className='size-4 shrink-0 text-indigo-600 dark:text-indigo-300'
            aria-hidden='true'
          />
          <span className='truncate text-sm font-semibold text-slate-900 dark:text-slate-50'>
            {ticket.subject?.trim() || t('supportFlow.tickets.untitled')}
          </span>
        </span>
        <ChevronRight
          className='size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5'
          aria-hidden='true'
        />
      </span>

      <span className='mt-2 flex w-full min-w-0 items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
        {ticket.ticketNumber !== null && ticket.ticketNumber !== undefined ? (
          <span className='shrink-0 font-medium tabular-nums'>
            {t('supportFlow.tickets.number', {
              number: ticket.ticketNumber,
            })}
          </span>
        ) : null}
        {ticket.status ? (
          <Badge
            presentation='reference'
            variant='outline'
            className={cn(
              'max-w-32 truncate px-1.5 py-0 text-[11px]',
              ticketStatusColors[ticket.status]
            )}
          >
            {t(TICKET_STATUS_TRANSLATION_KEYS[ticket.status])}
          </Badge>
        ) : null}
        {date ? (
          <span className='ms-auto flex min-w-0 items-center gap-1 truncate'>
            <Clock3 className='size-3 shrink-0' aria-hidden='true' />
            <span className='truncate'>
              {formatDateTime(date, undefined, {
                language: i18n.language,
                normalizeTimezone: false,
                invalidDate: 'throw',
              })}
            </span>
          </span>
        ) : null}
      </span>
    </button>
  )
})
