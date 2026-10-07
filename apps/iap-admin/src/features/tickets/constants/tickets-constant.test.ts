import {
  TICKET_CATEGORY_TRANSLATION_KEYS,
  TICKET_PRIORITY_TRANSLATION_KEYS,
  TICKET_STATUS_TRANSLATION_KEYS,
  getTicketCategoryOptions,
  getTicketPriorityOptions,
  ticketCategoryColors,
  ticketPriorityColors,
  ticketStatusColors,
} from '@features/tickets/constants/tickets-constant'
import { describe, expect, it } from 'vitest'

describe('ticket presentation contracts', () => {
  it('covers every source-backed status, priority, and category enum', () => {
    expect(TICKET_STATUS_TRANSLATION_KEYS).toEqual({
      ANSWERED: 'tickets.status.ANSWERED',
      ASSIGNED: 'tickets.status.ASSIGNED',
      CLOSED: 'tickets.status.CLOSED',
      OPEN: 'tickets.status.OPEN',
      WAITING_FOR_SUPPORT: 'tickets.status.WAITING_FOR_SUPPORT',
      WAITING_FOR_USER: 'tickets.status.WAITING_FOR_USER',
    })
    expect(TICKET_PRIORITY_TRANSLATION_KEYS).toEqual({
      HIGH: 'tickets.priority.HIGH',
      LOW: 'tickets.priority.LOW',
      NORMAL: 'tickets.priority.NORMAL',
      URGENT: 'tickets.priority.URGENT',
    })
    expect(TICKET_CATEGORY_TRANSLATION_KEYS).toEqual({
      CLAIM_ISSUE: 'tickets.category.CLAIM_ISSUE',
      INFO_ISSUE: 'tickets.category.INFO_ISSUE',
      PAYMENT: 'tickets.category.PAYMENT',
    })
  })

  it('keeps the source colour semantics for detail and table badges', () => {
    expect(ticketStatusColors.CLOSED).toBe(
      'border-slate-300 bg-slate-50 text-slate-700'
    )
    expect(ticketPriorityColors.URGENT).toBe(
      'border-red-300 bg-red-50 text-red-700'
    )
    expect(ticketCategoryColors.CLAIM_ISSUE).toBe(
      'border-orange-300 bg-orange-50 text-orange-700'
    )
  })
})

it('preserves the reference faceted option order', () => {
  const t = ((key: string) => key) as Parameters<
    typeof getTicketPriorityOptions
  >[0]
  expect(getTicketPriorityOptions(t).map((option) => option.value)).toEqual([
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT',
  ])
  expect(getTicketCategoryOptions(t).map((option) => option.value)).toEqual([
    'PAYMENT',
    'CLAIM_ISSUE',
    'INFO_ISSUE',
  ])
})
