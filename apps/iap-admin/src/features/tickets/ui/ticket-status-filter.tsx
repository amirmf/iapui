import { useLayoutEffect } from 'react'

import { ticketStatusSchema } from '@iap/api-types'
import { cn } from '@iap/ui'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const ticketStatusFilterSchema = ticketStatusSchema.exclude([
  'OPEN',
  'WAITING_FOR_USER',
])
const ticketStatuses = ['ALL', ...ticketStatusFilterSchema.options] as const

type TicketStatusFilterValue = (typeof ticketStatuses)[number]

type TicketStatusFilterProps = {
  count?: number
  isLoading?: boolean
  variant?: 'claim-request-context' | 'default'
}

const ticketStatusCounts = new Map<TicketStatusFilterValue, number>()

export function TicketStatusFilter(props: TicketStatusFilterProps) {
  const { count, isLoading, variant = 'default' } = props
  const { t } = useTranslation()
  const location = useLocation()
  const router = useRouter()
  const search = location.search as Record<
    string,
    string | string[] | undefined
  >
  const selectedStatus: TicketStatusFilterValue =
    search.status === 'ALL'
      ? 'ALL'
      : (ticketStatusFilterSchema.safeParse(search.status).data ?? 'ASSIGNED')
  const isClaimRequestContext = variant === 'claim-request-context'

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
          isSelected && !isLoading ? (count ?? 0) : cachedCount

        return (
          <button
            aria-pressed={isSelected}
            className={cn(
              'min-h-11 rounded bg-muted px-1 py-2 text-[0.8rem]',
              isClaimRequestContext &&
                'bg-primary-50 text-foreground hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:bg-primary-900 dark:hover:bg-primary-800 dark:focus-visible:ring-primary-300',
              isSelected && 'bg-primary font-medium text-muted shadow',
              isSelected &&
                isClaimRequestContext &&
                'dark:bg-primary-50 dark:text-primary-950'
            )}
            key={status}
            onClick={() => {
              router.navigate({
                replace: true,
                search: (previous) => ({
                  ...previous,
                  page: undefined,
                  status,
                }),
                to: './',
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
