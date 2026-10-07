import { useEffect } from 'react'

import { type SupportTicketMessage } from '@iap/api-types'
import { cn } from '@iap/ui'
import { formatDateTime } from '@iap/ui'
import { Button } from '@iap/ui'
import { Skeleton } from '@iap/ui'
import { Loader2, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useTicketMessages } from '../../queries/use-support-tickets'

type SupportTicketConversationProps = {
  ticketId: string
  ownershipConfirmed: boolean
  refreshKey: number
}

export function SupportTicketConversation(
  props: SupportTicketConversationProps
) {
  const { ticketId, ownershipConfirmed, refreshKey } = props
  const { t } = useTranslation()
  const query = useTicketMessages(ticketId, ownershipConfirmed)
  const { refetch } = query

  useEffect(() => {
    if (refreshKey === 0) return
    void refetch()
  }, [refetch, refreshKey])

  return (
    <section aria-labelledby='support-ticket-messages-title' className='mt-4'>
      <div className='mb-2 flex items-center justify-between gap-2'>
        <h4
          id='support-ticket-messages-title'
          className='text-sm font-semibold text-slate-950 dark:text-slate-50'
        >
          {t('supportFlow.tickets.messages')}
        </h4>
        {query.isFetchingNextPage ? (
          <span className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
            <Loader2 className='size-3.5 animate-spin' aria-hidden='true' />
            {t('supportFlow.tickets.loadingMore')}
          </span>
        ) : null}
      </div>

      {query.isLoading || query.isFetching ? <MessagesSkeleton /> : null}

      {query.isError && !query.data ? (
        <MessagesError onRetry={() => query.refetch()} />
      ) : null}

      {!query.isLoading && !query.isError && query.messages.length === 0 ? (
        <p className='rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400'>
          {t('supportFlow.tickets.noMessages')}
        </p>
      ) : null}

      {query.messages.length > 0 && !query.isFetching ? (
        <div className='space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/[0.03]'>
          {query.messages.map((message, index) => (
            <SupportTicketMessageEntry
              key={message.id ?? `${message.createdAt ?? 'message'}-${index}`}
              message={message}
            />
          ))}
        </div>
      ) : null}

      {query.isFetchNextPageError ? (
        <div
          role='alert'
          className='border-destructive/20 bg-destructive/5 text-destructive mt-3 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs'
        >
          <span>{t('supportFlow.tickets.errors.messagesMore')}</span>
          <Button
            presentation='reference'
            type='button'
            variant='ghost'
            size='xs'
            className='focus-visible:ring-destructive cursor-pointer focus-visible:ring-2'
            onClick={() => query.fetchNextPage()}
          >
            <RefreshCw className='size-3.5' aria-hidden='true' />
            {t('supportFlow.tickets.retry')}
          </Button>
        </div>
      ) : null}
    </section>
  )
}

function SupportTicketMessageEntry(props: { message: SupportTicketMessage }) {
  const { message } = props
  const { t, i18n } = useTranslation()
  const isUserMessage = message.senderType === 'USER'
  const senderLabel = isUserMessage
    ? t('supportFlow.tickets.you')
    : t('supportFlow.tickets.support')

  return (
    <article
      className={cn('flex', {
        'justify-start': isUserMessage,
        'justify-end': !isUserMessage,
      })}
    >
      <div
        className={cn(
          'w-fit max-w-[88%] min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm sm:max-w-[78%]',
          {
            'bg-primary text-primary-foreground rounded-es-sm': isUserMessage,
            'rounded-ee-sm border border-slate-200/80 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100':
              !isUserMessage,
          }
        )}
      >
        <div
          className={cn(
            'mb-1.5 flex items-center justify-between gap-2 border-b pb-1.5 text-xs',
            {
              'border-primary-foreground/20 text-primary-foreground/80':
                isUserMessage,
              'border-slate-200/80 text-slate-500 dark:border-white/10 dark:text-slate-400':
                !isUserMessage,
            }
          )}
        >
          <span className='font-medium'>{senderLabel}</span>
          <time className='dir-ltr'>
            {formatDateTime(message.createdAt, undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
          </time>
        </div>
        <p className='break-words whitespace-pre-wrap'>
          {message.body?.trim() || '-'}
        </p>
      </div>
    </article>
  )
}

function MessagesSkeleton() {
  return (
    <div
      className='space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4 dark:border-white/10 dark:bg-white/[0.03]'
      aria-hidden='true'
    >
      <div className='w-4/5 space-y-2 rounded-2xl rounded-es-sm border border-slate-200/80 bg-slate-100 p-3.5 sm:w-3/5 dark:border-white/10 dark:bg-slate-800'>
        <Skeleton className='h-3 w-1/3 bg-gray-200 motion-reduce:animate-pulse' />
        <Skeleton className='h-px w-full bg-gray-200 motion-reduce:animate-pulse' />
        <Skeleton className='h-8 w-full bg-gray-200 motion-reduce:animate-pulse' />
      </div>
      <div className='bg-primary ms-auto w-3/4 space-y-2 rounded-2xl rounded-ee-sm p-3.5 sm:w-1/2'>
        <Skeleton className='bg-primary-foreground/20 ms-auto h-3 w-2/5 motion-reduce:animate-pulse' />
        <Skeleton className='bg-primary-foreground/20 h-px w-full motion-reduce:animate-pulse' />
        <Skeleton className='bg-primary-foreground/20 h-7 w-full motion-reduce:animate-pulse' />
      </div>
      <div className='w-2/3 space-y-2 rounded-2xl rounded-es-sm border border-slate-200/80 bg-slate-100 p-3.5 sm:w-1/2 dark:border-white/10 dark:bg-slate-800'>
        <Skeleton className='h-3 w-1/4 bg-gray-200 motion-reduce:animate-pulse' />
        <Skeleton className='h-px w-full bg-gray-200 motion-reduce:animate-pulse' />
        <Skeleton className='h-7 w-full bg-gray-200 motion-reduce:animate-pulse' />
      </div>
    </div>
  )
}

function MessagesError(props: { onRetry: () => void }) {
  const { onRetry } = props
  const { t } = useTranslation()

  return (
    <div
      role='alert'
      className='border-destructive/20 bg-destructive/5 text-destructive flex flex-col items-center gap-3 rounded-xl border px-4 py-6 text-center text-sm'
    >
      <p>{t('supportFlow.tickets.errors.messages')}</p>
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
    </div>
  )
}
