import { type FormEvent, useState } from 'react'

import { Sheet, SheetContent } from '@iap/ui'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useTicketStore } from '../model/ticket-store'
import { ticketService } from '../services/ticket-service'
import { TicketCommunicationColumn } from './ticket-communication-column'
import { TicketDetailSheetHeader } from './ticket-detail-sheet-header'
import { TicketRelatedClaimRequestColumn } from './ticket-related-claim-request-column'

type TicketDetailSheetProps = {
  refetch: () => Promise<unknown>
}

export function TicketDetailSheet(props: TicketDetailSheetProps) {
  const { refetch } = props
  const currentRow = useTicketStore((state) => state.currentRow)
  const open = useTicketStore((state) => state.open)
  const setOpen = useTicketStore((state) => state.setOpen)
  const [body, setBody] = useState('')
  const ticketId = currentRow?.id ?? null
  const isOpen = open === 'detail'
  const ticketQuery = useQuery({
    enabled: isOpen && Boolean(ticketId),
    initialData: currentRow ?? undefined,
    queryFn: ({ signal }) =>
      ticketService.findById({ path: { id: ticketId! }, signal }),
    queryKey: ['tickets', ticketId],
  })
  const messagesQuery = useQuery({
    enabled: isOpen && Boolean(ticketId),
    queryFn: ({ signal }) =>
      ticketService.findMessages({
        path: { ticketId: ticketId! },
        query: { size: 100 },
        signal,
      }),
    queryKey: ['ticketMessages', ticketId],
  })
  const createMessage = useMutation({
    mutationFn: () =>
      ticketService.createMessage({
        body: { body },
        path: { ticketId: ticketId! },
      }),
    onSuccess: async () => {
      setBody('')
      await messagesQuery.refetch()
      await refetch()
    },
  })
  const closeTicket = useMutation({
    mutationFn: () => ticketService.close({ path: { ticketId: ticketId! } }),
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
