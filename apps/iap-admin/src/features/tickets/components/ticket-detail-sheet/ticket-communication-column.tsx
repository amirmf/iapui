import type { FormEvent } from 'react'

import { TicketDetailSheetActions } from '@features/tickets/components/ticket-detail-sheet/ticket-detail-sheet-actions'
import { TicketMessageList } from '@features/tickets/components/ticket-detail-sheet/ticket-message-list'
import { TicketReadonlyDetail } from '@features/tickets/components/ticket-detail-sheet/ticket-readonly-detail'
import type { SupportTicket, SupportTicketMessage } from '@iap/api-types'
import { Textarea } from '@iap/ui'
import { useTranslation } from 'react-i18next'

type TicketCommunicationColumnProps = {
  body: string
  canCloseTicket: boolean
  canSendMessage: boolean
  isClosingTicket: boolean
  isMessagesError: boolean
  isMessagesLoading: boolean
  isSendingMessage: boolean
  isTicketError: boolean
  isTicketLoading: boolean
  messages: SupportTicketMessage[]
  onBodyChange: (body: string) => void
  onCloseTicket: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  ticket?: SupportTicket
}

export function TicketCommunicationColumn(
  props: TicketCommunicationColumnProps
) {
  const {
    body,
    canCloseTicket,
    canSendMessage,
    isClosingTicket,
    isMessagesError,
    isMessagesLoading,
    isSendingMessage,
    isTicketError,
    isTicketLoading,
    messages,
    onBodyChange,
    onCloseTicket,
    onSubmit,
    ticket,
  } = props
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby='ticket-message-list-title'
      className='flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto rounded-lg border border-primary/20 bg-card p-4 shadow-sm lg:order-2 lg:rtl:order-1'
    >
      <TicketReadonlyDetail ticket={ticket} />
      {isTicketLoading ? (
        <p
          aria-live='polite'
          className='text-sm text-muted-foreground'
          role='status'
        >
          {t('tickets.detail.loading')}
        </p>
      ) : null}
      {isTicketError ? (
        <p className='text-sm text-destructive' role='alert'>
          {t('tickets.detail.error')}
        </p>
      ) : null}
      <TicketMessageList
        isError={isMessagesError}
        isLoading={isMessagesLoading}
        messages={messages}
      />
      <form className='space-y-2 border-t pt-4' onSubmit={onSubmit}>
        <label className='sr-only' htmlFor='ticket-message-body'>
          {t('tickets.messages.placeholder')}
        </label>
        <Textarea
          aria-busy={isSendingMessage}
          disabled={ticket?.status === 'CLOSED'}
          id='ticket-message-body'
          maxLength={4000}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder={t('tickets.messages.placeholder')}
          value={body}
        />
        <TicketDetailSheetActions
          canCloseTicket={canCloseTicket}
          canSendMessage={canSendMessage}
          isClosingTicket={isClosingTicket}
          isSendingMessage={isSendingMessage}
          onCloseTicket={onCloseTicket}
        />
      </form>
    </section>
  )
}
