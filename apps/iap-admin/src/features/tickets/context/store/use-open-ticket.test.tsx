// @vitest-environment jsdom
import type { PropsWithChildren } from 'react'

import { useTicketStore } from '@features/tickets/context/store/ticket-store'
import { useOpenTicket } from '@features/tickets/context/store/use-open-ticket'
import { ticketDetailQueryKey } from '@features/tickets/queries/ticket-queries'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'

afterEach(() => {
  cleanup()
  useTicketStore.getState().reset()
})
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const wrapper = (props: PropsWithChildren) => (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  )
  return { client, ...renderHook(useOpenTicket, { wrapper }) }
}
it('seeds uncached details while keeping only the selection identifier in UI state', () => {
  const { client, result } = setup()
  const ticket = { id: 'ticket-id', subject: 'selected row' }
  act(() => result.current(ticket))
  expect(client.getQueryData(ticketDetailQueryKey(ticket.id))).toEqual(ticket)
  expect(useTicketStore.getState()).toMatchObject({
    currentTicketId: ticket.id,
    open: 'detail',
  })
  expect(useTicketStore.getState()).not.toHaveProperty('currentRow')
  act(() => useTicketStore.getState().setOpen(null))
  expect(useTicketStore.getState().currentTicketId).toBeNull()
  expect(client.getQueryData(ticketDetailQueryKey(ticket.id))).toEqual(ticket)
})
it('retains fetched detail over the list snapshot, like the reference initialData', () => {
  const { client, result } = setup()
  const key = ticketDetailQueryKey('ticket-id')
  client.setQueryData(key, { id: 'ticket-id', subject: 'fetched detail' })
  act(() => result.current({ id: 'ticket-id', subject: 'older list snapshot' }))
  expect(client.getQueryData(key)).toEqual({
    id: 'ticket-id',
    subject: 'fetched detail',
  })
})
it('preserves the initial row display when the source ticket has no id', () => {
  const { client, result } = setup()
  act(() => result.current({ subject: 'no id' }))
  expect(client.getQueryData(ticketDetailQueryKey(null))).toEqual({
    subject: 'no id',
  })
  expect(useTicketStore.getState()).toMatchObject({
    currentTicketId: null,
    open: 'detail',
  })
})
