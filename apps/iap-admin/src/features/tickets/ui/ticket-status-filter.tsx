import { useLayoutEffect } from 'react'

import { cn } from '@iap/ui'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { toTicketStatusSearch } from '../model/ticket-navigation'

const ticketStatuses = [
  'ALL',
  'ASSIGNED',
  'WAITING_FOR_SUPPORT',
  'ANSWERED',
  'CLOSED',
] as const

type TicketStatusFilterValue = (typeof ticketStatuses)[number]

type TicketStatusFilterProps = {
  count?: number
  isFetching?: boolean
}

const ticketStatusCounts = new Map<TicketStatusFilterValue, number>()

export function TicketStatusFilter(props: TicketStatusFilterProps) {
  const { count, isFetching = false } = props
  const { t } = useTranslation()
  const location = useLocation()
  const router = useRouter()
  const search = location.search as Record<
    string,
    string | string[] | undefined
  >
  const selectedStatus = ticketStatuses.includes(
    search.status as TicketStatusFilterValue
  )
    ? (search.status as TicketStatusFilterValue)
    : 'ASSIGNED'

  useLayoutEffect(() => {
    ticketStatusCounts.clear()
  }, [])

  ticketStatusCounts.set(selectedStatus, count ?? 0)

  return (
    <div
      aria-label={t('tickets.columns.status')}
      className='grid grid-cols-2 sm:grid-cols-5'
      role='group'
    >
      {ticketStatuses.map((status) => {
        const isSelected = selectedStatus === status
        const cachedCount = ticketStatusCounts.get(status) ?? '-'
        const displayedCount =
          isSelected && !isFetching ? (count ?? 0) : cachedCount

        return (
          <button
            aria-pressed={isSelected}
            className={cn(
              'min-h-11 rounded bg-muted px-1 py-2 text-[0.8rem]',
              isSelected && 'bg-primary font-medium text-muted shadow'
            )}
            key={status}
            onClick={() => {
              router.navigate({
                replace: true,
                search: toTicketStatusSearch(search, status) as never,
                to: '/claim-requests/',
              })
            }}
            type='button'
          >
            <p>
              {status === 'ALL'
                ? t('common.all')
                : t(`tickets.status.${status}` as never)}
            </p>
            <p>({displayedCount})</p>
          </button>
        )
      })}
    </div>
  )
}
