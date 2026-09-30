import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '@iap/api-types'
import type { TFunction } from 'i18next'

export const ticketStatusTranslationKeys: Record<
  TicketStatus,
  `tickets.status.${TicketStatus}`
> = {
  ANSWERED: 'tickets.status.ANSWERED',
  ASSIGNED: 'tickets.status.ASSIGNED',
  CLOSED: 'tickets.status.CLOSED',
  OPEN: 'tickets.status.OPEN',
  WAITING_FOR_SUPPORT: 'tickets.status.WAITING_FOR_SUPPORT',
  WAITING_FOR_USER: 'tickets.status.WAITING_FOR_USER',
}

export const ticketPriorityTranslationKeys: Record<
  TicketPriority,
  `tickets.priority.${TicketPriority}`
> = {
  HIGH: 'tickets.priority.HIGH',
  LOW: 'tickets.priority.LOW',
  NORMAL: 'tickets.priority.NORMAL',
  URGENT: 'tickets.priority.URGENT',
}

export const ticketCategoryTranslationKeys: Record<
  TicketCategory,
  `tickets.category.${TicketCategory}`
> = {
  CLAIM_ISSUE: 'tickets.category.CLAIM_ISSUE',
  INFO_ISSUE: 'tickets.category.INFO_ISSUE',
  PAYMENT: 'tickets.category.PAYMENT',
}

// These visual states are kept in sync with the reference tickets constants.
export const ticketStatusClasses: Record<TicketStatus, string> = {
  ANSWERED: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  ASSIGNED: 'border-purple-300 bg-purple-50 text-purple-700',
  CLOSED: 'border-slate-300 bg-slate-50 text-slate-700',
  OPEN: 'border-blue-300 bg-blue-50 text-blue-700',
  WAITING_FOR_SUPPORT: 'border-orange-300 bg-orange-50 text-orange-700',
  WAITING_FOR_USER: 'border-amber-300 bg-amber-50 text-amber-700',
}

export const ticketPriorityClasses: Record<TicketPriority, string> = {
  HIGH: 'border-orange-300 bg-orange-50 text-orange-700',
  LOW: 'border-slate-300 bg-slate-50 text-slate-700',
  NORMAL: 'border-blue-300 bg-blue-50 text-blue-700',
  URGENT: 'border-red-300 bg-red-50 text-red-700',
}

export const ticketCategoryClasses: Record<TicketCategory, string> = {
  CLAIM_ISSUE: 'border-orange-300 bg-orange-50 text-orange-700',
  INFO_ISSUE: 'border-purple-300 bg-purple-50 text-purple-700',
  PAYMENT: 'border-blue-300 bg-blue-50 text-blue-700',
}

function toOptions<T extends string>(
  translations: Record<T, string>,
  t: TFunction
) {
  return Object.entries(translations).map(([value, label]) => ({
    label: t(label as never) as string,
    value,
  }))
}

export function getTicketPriorityOptions(t: TFunction) {
  return toOptions(ticketPriorityTranslationKeys, t)
}

export function getTicketCategoryOptions(t: TFunction) {
  return toOptions(ticketCategoryTranslationKeys, t)
}
