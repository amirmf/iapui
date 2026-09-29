import type { SupportTicketMessage } from '@iap/api-types'
import { cn, formatDateTime } from '@iap/ui'
import { useTranslation } from 'react-i18next'

type TicketMessageListProps = {
  isError: boolean
  isLoading: boolean
  messages: SupportTicketMessage[]
}

export function TicketMessageList(props: TicketMessageListProps) {
  const { isError, isLoading, messages } = props
  const { t } = useTranslation()

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-3'>
      <h3 id='ticket-message-list-title' className='text-lg font-semibold'>
        {t('tickets.messages.title')}
      </h3>
      <div className='min-h-0 flex-1 overflow-auto rounded-md border p-3'>
        {isLoading ? (
          <p
            aria-live='polite'
            className='text-sm text-muted-foreground'
            role='status'
          >
            {t('tickets.messages.loading')}
          </p>
        ) : null}
        {isError ? (
          <p className='text-sm text-destructive' role='alert'>
            {t('tickets.messages.error')}
          </p>
        ) : null}
        {!isLoading && !messages.length ? (
          <p className='text-sm text-muted-foreground'>
            {t('tickets.messages.empty')}
          </p>
        ) : null}
        <div className='space-y-3'>
          {messages.map((message) => (
            <TicketMessage
              key={message.id ?? message.createdAt}
              message={message}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function TicketMessage(props: { message: SupportTicketMessage }) {
  const { message } = props
  const { t } = useTranslation()
  const isSystemMessage = message.senderType === 'SYSTEM'
  const isSupportMessage = message.senderType === 'ASSESSMENT_USER'

  if (isSystemMessage)
    return (
      <div className='flex justify-center'>
        <div className='max-w-[90%] rounded-md border bg-muted/40 px-3 py-2 text-center text-sm text-muted-foreground'>
          <p className='whitespace-pre-wrap'>{message.body ?? '-'}</p>
          <span className='mt-1 block text-xs'>
            {formatDateTime(message.createdAt)}
          </span>
        </div>
      </div>
    )

  return (
    <div
      className={cn(
        'flex w-full',
        isSupportMessage ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'w-fit min-w-0 max-w-[88%] rounded-lg border p-3 text-sm shadow-sm',
          isSupportMessage
            ? 'rounded-es-sm bg-primary text-primary-foreground'
            : 'rounded-ee-sm bg-muted/40'
        )}
      >
        <div
          className={cn(
            'mb-2 flex flex-wrap items-center justify-between gap-2 text-xs',
            isSupportMessage
              ? 'flex-row-reverse text-primary-foreground/80'
              : 'text-muted-foreground'
          )}
        >
          <span>
            {message.senderUsername?.trim() ||
              t('tickets.messages.unknownSender')}
          </span>
          <span>{formatDateTime(message.createdAt)}</span>
        </div>
        <p
          className={cn(
            'whitespace-pre-wrap',
            !isSupportMessage && 'text-left'
          )}
        >
          {message.body ?? '-'}
        </p>
      </div>
    </div>
  )
}
