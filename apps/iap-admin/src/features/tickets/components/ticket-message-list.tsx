import type { SupportTicketMessage } from '@iap/api-types'
import { useTranslation } from 'react-i18next'

import { TicketMessage } from './ticket-message'

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
