import type { SupportTicketMessage } from '@iap/api-types'
import { cn, formatDateTime } from '@iap/ui'
import { useTranslation } from 'react-i18next'

type TicketMessageProps = {
  message: SupportTicketMessage
}

export function TicketMessage(props: TicketMessageProps) {
  const { message } = props
  const { t, i18n } = useTranslation()
  const isSystemMessage = message.senderType === 'SYSTEM'
  const isSupportMessage = message.senderType === 'ASSESSMENT_USER'

  if (isSystemMessage) {
    return (
      <div className='flex justify-center'>
        <div className='max-w-[90%] rounded-md border bg-muted/40 px-3 py-2 text-center text-sm text-muted-foreground'>
          <p className='whitespace-pre-wrap'>{message.body ?? '-'}</p>
          <span className='mt-1 block text-xs'>
            {formatDateTime(message.createdAt, undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
          </span>
        </div>
      </div>
    )
  }

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
          <span>
            {formatDateTime(message.createdAt, undefined, {
              language: i18n.language,
              normalizeTimezone: false,
              invalidDate: 'throw',
            })}
          </span>
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
