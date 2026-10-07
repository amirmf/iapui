import { useState } from 'react'

import { cn } from '@iap/ui'
import { formatDateTime } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Button } from '@iap/ui'
import { Skeleton } from '@iap/ui'
import { isAxiosError } from 'axios'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  TICKET_STATUS_TRANSLATION_KEYS,
  ticketStatusColors,
} from '../../model/ticket-status'
import {
  SupportTicketOwnershipError,
  isValidSupportTicketId,
  useTicketDetails,
} from '../../queries/use-support-tickets'
import { getSupportClaimRequestUrl } from '../../route-adapters/support-claim-request-url'
import { SupportTicketConversation } from './support-ticket-conversation'

type SupportTicketDetailsProps = {
  ticketId: string
  onBack: () => void
}

export function SupportTicketDetails(props: SupportTicketDetailsProps) {
  const { ticketId, onBack } = props
  const { t, i18n } = useTranslation()
  const isValidTicketId = isValidSupportTicketId(ticketId)
  const query = useTicketDetails(ticketId)
  const ticket = query.data
  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0)

  const handleRefresh = () => {
    void query.refetch()
    setMessagesRefreshKey((key) => key + 1)
  }

  return (
    <div className='relative z-10 flex min-h-0 flex-1 flex-col'>
      <div className='flex shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/80 px-3 py-2.5 backdrop-blur-xl sm:px-4 dark:border-white/10 dark:bg-slate-950/80'>
        <Button
          presentation='reference'
          type='button'
          variant='ghost'
          size='icon'
          className='size-9 cursor-pointer rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-200'
          onClick={onBack}
          aria-label={t('supportFlow.tickets.back')}
        >
          <ArrowLeft className='size-4 rtl:rotate-180' aria-hidden='true' />
        </Button>
        <div className='min-w-0'>
          <h3 className='truncate text-sm font-semibold text-slate-950 dark:text-slate-50'>
            {t('supportFlow.tickets.ticketDetails')}
          </h3>
          {ticket?.ticketNumber !== null &&
          ticket?.ticketNumber !== undefined ? (
            <p className='truncate text-xs text-slate-500 dark:text-slate-400'>
              {t('supportFlow.tickets.number', {
                number: ticket.ticketNumber,
              })}
            </p>
          ) : null}
        </div>
        <Button
          presentation='reference'
          type='button'
          variant='ghost'
          size='icon'
          className='ms-auto size-9 cursor-pointer rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-200'
          onClick={handleRefresh}
          disabled={query.isFetching || !isValidTicketId}
          aria-label={t('supportFlow.tickets.refresh')}
        >
          <RefreshCw
            className={cn('size-4', query.isFetching && 'animate-spin')}
            aria-hidden='true'
          />
        </Button>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin] sm:px-4'>
        {!isValidTicketId ? (
          <DetailsError message={t('supportFlow.tickets.errors.invalidId')} />
        ) : null}

        {query.isLoading || query.isFetching ? <TicketDetailsSkeleton /> : null}

        {query.isError ? (
          <DetailsError
            message={getTicketErrorMessage(query.error, t)}
            onRetry={() => query.refetch()}
          />
        ) : null}

        {ticket && !query.isFetching ? (
          <>
            <article className='rounded-xl border border-slate-200/80 bg-white/75 p-3.5 shadow-sm dark:border-white/10 dark:bg-white/[0.05]'>
              <div className='flex items-start justify-between'>
                <h4 className='text-base leading-6 font-semibold whitespace-pre-wrap text-slate-950 dark:text-slate-50'>
                  {ticket.subject?.trim() || t('supportFlow.tickets.untitled')}
                </h4>
                {ticket.status ? (
                  <Badge
                    presentation='reference'
                    variant='outline'
                    className={cn('h-auto', ticketStatusColors[ticket.status])}
                  >
                    {t(TICKET_STATUS_TRANSLATION_KEYS[ticket.status])}
                  </Badge>
                ) : null}
              </div>

              <dl className='mt-2 grid grid-cols-1 gap-3 border-t border-slate-200/80 pt-3 text-xs sm:grid-cols-2 dark:border-white/10'>
                <TicketDetailValue
                  label={t('supportFlow.tickets.createdAt')}
                  value={formatDateTime(ticket.createdAt, undefined, {
                    language: i18n.language,
                    normalizeTimezone: false,
                    invalidDate: 'throw',
                  })}
                />
                <TicketDetailValue
                  label={t('supportFlow.tickets.updatedAt')}
                  value={formatDateTime(ticket.updatedAt, undefined, {
                    language: i18n.language,
                    normalizeTimezone: false,
                    invalidDate: 'throw',
                  })}
                />
                {ticket.lastMessageAt ? (
                  <TicketDetailValue
                    label={t('supportFlow.tickets.lastMessageAt')}
                    value={formatDateTime(ticket.lastMessageAt, undefined, {
                      language: i18n.language,
                      normalizeTimezone: false,
                      invalidDate: 'throw',
                    })}
                  />
                ) : null}
                {ticket.claimRequestId ? (
                  <div className='min-w-0'>
                    <Button
                      presentation='reference'
                      size='xs'
                      variant='secondary'
                      asChild
                    >
                      <a
                        href={getSupportClaimRequestUrl(ticket.claimRequestId)}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {t('supportFlow.tickets.viewClaimRequest')}
                      </a>
                    </Button>
                  </div>
                ) : null}
              </dl>
            </article>

            <SupportTicketConversation
              ticketId={ticketId}
              ownershipConfirmed
              refreshKey={messagesRefreshKey}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

function TicketDetailValue(props: { label: string; value: string }) {
  const { label, value } = props
  return (
    <div className='min-w-0'>
      <dt className='font-medium text-slate-500 dark:text-slate-400'>
        {label}
      </dt>
      <dd className='mt-1 font-medium break-words text-slate-800 dark:text-slate-100'>
        {value}
      </dd>
    </div>
  )
}

function TicketDetailsSkeleton() {
  return (
    <div
      className='rounded-xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]'
      aria-hidden='true'
    >
      <Skeleton className='h-5 w-3/4 bg-gray-200 motion-reduce:animate-pulse' />
      <div className='mt-4 flex gap-2'>
        <Skeleton className='h-5 w-20 bg-gray-200 motion-reduce:animate-pulse' />
        <Skeleton className='h-5 w-16 bg-gray-200 motion-reduce:animate-pulse' />
      </div>
      <Skeleton className='mt-5 h-3 w-full bg-gray-200 motion-reduce:animate-pulse' />
      <Skeleton className='mt-3 h-3 w-4/5 bg-gray-200 motion-reduce:animate-pulse' />
    </div>
  )
}

function DetailsError(props: { message: string; onRetry?: () => void }) {
  const { message, onRetry } = props
  const { t } = useTranslation()

  return (
    <div
      role='alert'
      className={cn(
        'border-destructive/20 bg-destructive/5 text-destructive flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border px-5 text-center text-sm'
      )}
    >
      <p>{message}</p>
      {onRetry ? (
        <Button
          presentation='reference'
          type='button'
          variant='outline'
          size='sm'
          className='focus-visible:ring-destructive cursor-pointer focus-visible:ring-2'
          onClick={onRetry}
        >
          <RefreshCw className='size-4' aria-hidden='true' />
          {t('supportFlow.tickets.retry')}
        </Button>
      ) : null}
    </div>
  )
}

function getTicketErrorMessage(
  error: Error,
  t: (
    key:
      | 'supportFlow.tickets.errors.forbidden'
      | 'supportFlow.tickets.errors.notFound'
      | 'supportFlow.tickets.errors.details'
  ) => string
) {
  if (error instanceof SupportTicketOwnershipError) {
    return t('supportFlow.tickets.errors.forbidden')
  }

  const status = isAxiosError(error) ? error.response?.status : undefined

  if (status === 403) return t('supportFlow.tickets.errors.forbidden')
  if (status === 404) return t('supportFlow.tickets.errors.notFound')
  return t('supportFlow.tickets.errors.details')
}
