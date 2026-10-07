import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { useTicketStore } from '@features/tickets/context/store/ticket-store'

type TicketProviderProps = {
  children: ReactNode
}

export function TicketProvider(props: TicketProviderProps) {
  const { children } = props
  const reset = useTicketStore((state) => state.reset)

  useEffect(() => reset, [reset])

  return children
}
