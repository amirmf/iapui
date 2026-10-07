import { type FormEvent, useState } from 'react'

import { TicketCommunicationColumn } from '@features/tickets/components/ticket-detail-sheet/ticket-communication-column'
import { TicketDetailSheetHeader } from '@features/tickets/components/ticket-detail-sheet/ticket-detail-sheet-header'
import { TicketRelatedClaimRequestColumn } from '@features/tickets/components/ticket-detail-sheet/ticket-related-claim-request-column'
import { useTicketStore } from '@features/tickets/context/store/ticket-store'
import {
  closeTicketMutationOptions,
  createTicketMessageMutationOptions,
} from '@features/tickets/queries/ticket-mutations'
import {
  ticketDetailQueryOptions,
  ticketMessagesQueryOptions,
} from '@features/tickets/queries/ticket-queries'
import { Sheet, SheetContent } from '@iap/ui'
import { useMutation, useQuery } from '@tanstack/react-query'

type TicketDetailSheetProps = {
  refetch: () => Promise<unknown>
}

export function TicketDetailSheet(props: TicketDetailSheetProps) {
  const { refetch } = props
  const ticketId = useTicketStore((state) => state.currentTicketId)
  const open = useTicketStore((state) => state.open)
  const setOpen = useTicketStore((state) => state.setOpen)
  const [body, setBody] = useState('')
  const isOpen = open === 'detail'
  const ticketQuery = useQuery(ticketDetailQueryOptions(ticketId, isOpen))
  const messagesQuery = useQuery(ticketMessagesQueryOptions(ticketId, isOpen))
  const createMessage = useMutation({
    ...createTicketMessageMutationOptions(ticketId, body),
    onSuccess: async () => {
      setBody('')
      await messagesQuery.refetch()
      await refetch()
    },
  })
  const closeTicket = useMutation({
    ...closeTicketMutationOptions(ticketId),
    onSuccess: async () => {
      await ticketQuery.refetch()
      await refetch()
      handleOpenChange(false)
    },
  })
  const ticket = ticketQuery.data
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (ticketId && body.trim()) createMessage.mutate()
  }
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen ? 'detail' : null)
    if (!nextOpen) setBody('')
  }

  return (
    <Sheet onOpenChange={handleOpenChange} open={isOpen}>
      <SheetContent
        presentation='reference'
        className='flex h-full w-full flex-col overflow-hidden sm:max-w-5xl lg:max-w-7xl'
        side='right'
      >
        <TicketDetailSheetHeader ticket={ticket} />
        <div className='grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:overflow-hidden'>
          <TicketCommunicationColumn
            body={body}
            canCloseTicket={Boolean(ticketId) && ticket?.status !== 'CLOSED'}
            canSendMessage={
              Boolean(ticketId) &&
              Boolean(body.trim()) &&
              ticket?.status !== 'CLOSED'
            }
            isClosingTicket={closeTicket.isPending}
            isMessagesError={messagesQuery.isError}
            isMessagesLoading={messagesQuery.isLoading}
            isSendingMessage={createMessage.isPending}
            isTicketError={ticketQuery.isError}
            isTicketLoading={ticketQuery.isLoading}
            messages={messagesQuery.data?.content ?? []}
            onBodyChange={setBody}
            onCloseTicket={() => {
              if (ticketId && ticket?.status !== 'CLOSED') closeTicket.mutate()
            }}
            onSubmit={handleSubmit}
            ticket={ticket}
          />
          <TicketRelatedClaimRequestColumn isOpen={isOpen} ticket={ticket} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
