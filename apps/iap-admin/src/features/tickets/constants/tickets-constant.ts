import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketVisibility,
} from '@iap/api-types'
import type { TFunction } from 'i18next'

export const ticketStatusColors: Record<TicketStatus, string> = {
  OPEN: 'border-blue-300 bg-blue-50 text-blue-700',
  ASSIGNED: 'border-purple-300 bg-purple-50 text-purple-700',
  WAITING_FOR_USER: 'border-amber-300 bg-amber-50 text-amber-700',
  WAITING_FOR_SUPPORT: 'border-orange-300 bg-orange-50 text-orange-700',
  ANSWERED: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  CLOSED: 'border-slate-300 bg-slate-50 text-slate-700',
}

export const ticketPriorityColors: Record<TicketPriority, string> = {
  LOW: 'border-slate-300 bg-slate-50 text-slate-700',
  NORMAL: 'border-blue-300 bg-blue-50 text-blue-700',
  HIGH: 'border-orange-300 bg-orange-50 text-orange-700',
  URGENT: 'border-red-300 bg-red-50 text-red-700',
}

export const ticketVisibilityColors: Record<TicketVisibility, string> = {
  PUBLIC: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  INTERNAL: 'border-amber-300 bg-amber-50 text-amber-700',
}

export const ticketCategoryColors: Record<TicketCategory, string> = {
  PAYMENT: 'border-blue-300 bg-blue-50 text-blue-700',
  CLAIM_ISSUE: 'border-orange-300 bg-orange-50 text-orange-700',
  INFO_ISSUE: 'border-purple-300 bg-purple-50 text-purple-700',
}

export const TICKET_STATUS_TRANSLATION_KEYS: Record<
  TicketStatus,
  `tickets.status.${TicketStatus}`
> = {
  OPEN: 'tickets.status.OPEN',
  ASSIGNED: 'tickets.status.ASSIGNED',
  WAITING_FOR_USER: 'tickets.status.WAITING_FOR_USER',
  WAITING_FOR_SUPPORT: 'tickets.status.WAITING_FOR_SUPPORT',
  ANSWERED: 'tickets.status.ANSWERED',
  CLOSED: 'tickets.status.CLOSED',
}

export const TICKET_PRIORITY_TRANSLATION_KEYS: Record<
  TicketPriority,
  `tickets.priority.${TicketPriority}`
> = {
  LOW: 'tickets.priority.LOW',
  NORMAL: 'tickets.priority.NORMAL',
  HIGH: 'tickets.priority.HIGH',
  URGENT: 'tickets.priority.URGENT',
}

export const TICKET_CATEGORY_TRANSLATION_KEYS: Record<
  TicketCategory,
  `tickets.category.${TicketCategory}`
> = {
  PAYMENT: 'tickets.category.PAYMENT',
  CLAIM_ISSUE: 'tickets.category.CLAIM_ISSUE',
  INFO_ISSUE: 'tickets.category.INFO_ISSUE',
}

export const TICKET_VISIBILITY_TRANSLATION_KEYS: Record<
  TicketVisibility,
  `tickets.visibility.${TicketVisibility}`
> = {
  PUBLIC: 'tickets.visibility.PUBLIC',
  INTERNAL: 'tickets.visibility.INTERNAL',
}

export const getTicketStatusOptions = (
  t: TFunction
): Array<{ label: string; value: TicketStatus }> => {
  return Object.entries(TICKET_STATUS_TRANSLATION_KEYS).map(
    ([status, translationKey]) => ({
      label: t(translationKey),
      value: status as TicketStatus,
    })
  )
}

export const getTicketPriorityOptions = (
  t: TFunction
): Array<{ label: string; value: TicketPriority }> => {
  return Object.entries(TICKET_PRIORITY_TRANSLATION_KEYS).map(
    ([priority, translationKey]) => ({
      label: t(translationKey),
      value: priority as TicketPriority,
    })
  )
}

export const getTicketCategoryOptions = (
  t: TFunction
): Array<{ label: string; value: TicketCategory }> => {
  return Object.entries(TICKET_CATEGORY_TRANSLATION_KEYS).map(
    ([category, translationKey]) => ({
      label: t(translationKey),
      value: category as TicketCategory,
    })
  )
}
