import { describe, expect, it } from 'vitest'

import {
  ticketCategoryClasses,
  ticketCategoryTranslationKeys,
  ticketPriorityClasses,
  ticketPriorityTranslationKeys,
  ticketStatusClasses,
  ticketStatusTranslationKeys,
} from './ticket-presentation'

describe('ticket presentation contracts', () => {
  it('covers every source-backed status, priority, and category enum', () => {
    expect(ticketStatusTranslationKeys).toEqual({
      ANSWERED: 'tickets.status.ANSWERED',
      ASSIGNED: 'tickets.status.ASSIGNED',
      CLOSED: 'tickets.status.CLOSED',
      OPEN: 'tickets.status.OPEN',
      WAITING_FOR_SUPPORT: 'tickets.status.WAITING_FOR_SUPPORT',
      WAITING_FOR_USER: 'tickets.status.WAITING_FOR_USER',
    })
    expect(ticketPriorityTranslationKeys).toEqual({
      HIGH: 'tickets.priority.HIGH',
      LOW: 'tickets.priority.LOW',
      NORMAL: 'tickets.priority.NORMAL',
      URGENT: 'tickets.priority.URGENT',
    })
    expect(ticketCategoryTranslationKeys).toEqual({
      CLAIM_ISSUE: 'tickets.category.CLAIM_ISSUE',
      INFO_ISSUE: 'tickets.category.INFO_ISSUE',
      PAYMENT: 'tickets.category.PAYMENT',
    })
  })

  it('keeps the source colour semantics for detail and table badges', () => {
    expect(ticketStatusClasses.CLOSED).toBe(
      'border-slate-300 bg-slate-50 text-slate-700'
    )
    expect(ticketPriorityClasses.URGENT).toBe(
      'border-red-300 bg-red-50 text-red-700'
    )
    expect(ticketCategoryClasses.CLAIM_ISSUE).toBe(
      'border-orange-300 bg-orange-50 text-orange-700'
    )
  })
})
