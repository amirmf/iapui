import { type ComponentType, type ReactNode, useMemo } from 'react'

import {
  TICKET_STATUS_TRANSLATION_KEYS,
  ticketStatusColors,
} from '@features/tickets/constants/tickets-constant'
import type { SupportTicketStatusHistory, TicketStatus } from '@iap/api-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
  formatDateTime,
} from '@iap/ui'
import {
  CheckCircle,
  Circle,
  CircleDot,
  Clock,
  HelpCircle,
  MessagesSquare,
  UserCheck,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

type TicketStatusHistoryDialogProps = {
  children: ReactNode
  statusHistory?: SupportTicketStatusHistory[] | null
}

const ticketStatusIconMap: Record<
  TicketStatus,
  ComponentType<{ className?: string }>
> = {
  ANSWERED: MessagesSquare,
  ASSIGNED: UserCheck,
  CLOSED: CheckCircle,
  OPEN: CircleDot,
  WAITING_FOR_SUPPORT: HelpCircle,
  WAITING_FOR_USER: Clock,
}

function getUserLabel(entry: SupportTicketStatusHistory) {
  const displayName = entry.changedByDisplayName?.trim()
  const username = entry.changedByUsername?.trim()
  const userId = entry.changedByUserAccountId?.trim()

  if (displayName && username) return `${displayName} (${username})`
  return displayName || username || userId || null
}

export function TicketStatusHistoryDialog(
  props: TicketStatusHistoryDialogProps
) {
  const { children, statusHistory } = props
  const { t } = useTranslation()
  const history = useMemo(
    () => [...(statusHistory ?? [])].reverse(),
    [statusHistory]
  )

  return (
    <Dialog>
      <DialogTrigger asChild disabled={!history.length}>
        {children}
      </DialogTrigger>
      <DialogContent presentation='reference' className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('tickets.statusHistory.title')}</DialogTitle>
          <DialogDescription>
            {t('tickets.statusHistory.description')}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-auto pe-4'>
          <ol className='space-y-0'>
            {history.map((entry, index) => (
              <TicketStatusHistoryEntry
                entry={entry}
                isFirst={index === 0}
                isLast={index === history.length - 1}
                key={`${entry.fromStatus ?? 'none'}-${entry.toStatus ?? 'status'}-${entry.changedAt ?? index}`}
              />
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type TicketStatusHistoryEntryProps = {
  entry: SupportTicketStatusHistory
  isFirst: boolean
  isLast: boolean
}

function TicketStatusHistoryEntry(props: TicketStatusHistoryEntryProps) {
  const { entry, isFirst, isLast } = props
  const { t, i18n } = useTranslation()
  const status = entry.toStatus
  const Icon = status ? ticketStatusIconMap[status] : Circle
  const userLabel = getUserLabel(entry)

  return (
    <li className='relative flex gap-3 pb-6 last:pb-0'>
      {!isLast ? (
        <span className='absolute bottom-0 top-10 h-full w-px bg-border ltr:left-5 rtl:right-5' />
      ) : null}
      <span
        className={cn(
          'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-dialog-background',
          isFirst && status && ticketStatusColors[status]
        )}
      >
        <Icon className='h-5 w-5' />
      </span>
      <div
        className={cn(
          'min-w-0 flex-1 rounded-lg border bg-background p-3 text-sm shadow-sm',
          isFirst && status && ticketStatusColors[status]
        )}
      >
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <p className='font-medium'>
            {status ? t(TICKET_STATUS_TRANSLATION_KEYS[status]) : '-'}
          </p>
          <time className='text-xs'>
            {formatDateTime(entry.changedAt, 'HH:mm yyyy/MM/dd', {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
          </time>
        </div>
        {userLabel ? (
          <p className='mt-2 text-xs'>
            {t('tickets.statusHistory.user', { userId: userLabel })}
          </p>
        ) : null}
      </div>
    </li>
  )
}
