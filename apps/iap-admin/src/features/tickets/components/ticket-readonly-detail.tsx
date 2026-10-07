import type { ReactNode } from 'react'

import type { SupportTicket } from '@iap/api-types'
import { Badge, badgeVariants, cn, formatDateTime } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import {
  ticketCategoryClasses,
  ticketCategoryTranslationKeys,
  ticketPriorityClasses,
  ticketPriorityTranslationKeys,
  ticketStatusClasses,
  ticketStatusTranslationKeys,
} from '../model/ticket-presentation'
import { TicketStatusHistoryDialog } from './ticket-status-history-dialog'

type TicketReadonlyDetailProps = {
  ticket?: SupportTicket
}

export function TicketReadonlyDetail(props: TicketReadonlyDetailProps) {
  const { ticket } = props
  const { t, i18n } = useTranslation()
  const ownerDisplayName = ticket?.ownerUserAccount?.displayName
  const ownerUsername = ticket?.ownerUserAccount?.username
  const owner =
    ownerDisplayName && ownerUsername
      ? `${ownerDisplayName} (${ownerUsername})`
      : ownerDisplayName || '-'

  return (
    <div className='flex flex-wrap items-center gap-y-1 px-4 text-sm'>
      <TicketMetadataItem
        title={t('tickets.columns.status')}
        value={
          ticket?.status ? (
            <TicketStatusHistoryDialog statusHistory={ticket.statusHistory}>
              <button
                aria-label={t('tickets.statusHistory.open')}
                className={cn(
                  badgeVariants({ variant: 'outline' }),
                  'w-fit disabled:cursor-default disabled:opacity-100',
                  ticket.statusHistory?.length &&
                    'cursor-pointer hover:ring-2 hover:ring-ring/20 focus-visible:ring-ring/50',
                  ticketStatusClasses[ticket.status]
                )}
                disabled={!ticket.statusHistory?.length}
                type='button'
              >
                {t(ticketStatusTranslationKeys[ticket.status])}
              </button>
            </TicketStatusHistoryDialog>
          ) : (
            '-'
          )
        }
      />
      <TicketMetadataItem
        title={t('tickets.columns.priority')}
        value={
          ticket?.priority ? (
            <Badge
              presentation='reference'
              className={cn('w-fit', ticketPriorityClasses[ticket.priority])}
              variant='outline'
            >
              {t(ticketPriorityTranslationKeys[ticket.priority])}
            </Badge>
          ) : (
            '-'
          )
        }
      />
      <TicketMetadataItem
        title={t('tickets.columns.category')}
        value={
          ticket?.category ? (
            <Badge
              presentation='reference'
              className={cn('w-fit', ticketCategoryClasses[ticket.category])}
              variant='outline'
            >
              {t(ticketCategoryTranslationKeys[ticket.category])}
            </Badge>
          ) : (
            '-'
          )
        }
      />
      <TicketMetadataItem
        title={t('tickets.detail.ownerDisplayName')}
        value={owner}
      />
      <TicketMetadataItem
        title={t('tickets.detail.assignedUserDisplayName')}
        value={ticket?.assignedUserAccount?.displayName ?? '-'}
      />
      <TicketMetadataItem
        hasSeparator={false}
        title={t('tickets.columns.createdAt')}
        value={formatDateTime(ticket?.createdAt, undefined, {
          language: i18n.language,
          normalizeTimezone: false,
          invalidDate: 'throw',
        })}
      />
    </div>
  )
}

type TicketMetadataItemProps = {
  hasSeparator?: boolean
  title: string
  value: ReactNode
}

function TicketMetadataItem(props: TicketMetadataItemProps) {
  const { hasSeparator = true, title, value } = props

  return (
    <div className='flex min-w-0 px-1'>
      <p className='whitespace-nowrap pe-0.5 text-sm font-medium text-gray-400'>
        {title}:
      </p>
      {typeof value === 'string' ? (
        <p className='min-w-0 whitespace-pre-wrap break-all text-sm font-semibold text-text-primary'>
          {value}
        </p>
      ) : (
        value
      )}
      {hasSeparator ? <span className='text-gray-500'>,</span> : null}
    </div>
  )
}
