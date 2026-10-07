import { useEffect } from 'react'

import { Button } from '@iap/ui'
import { Skeleton } from '@iap/ui'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useRecentTickets } from '../../queries/use-support-tickets'
import { SupportTicketItem } from './support-ticket-item'

type RecentAnsweredTicketsProps = {
  onOpenAll: () => void
  onOpenTicket: (ticketId: string) => void
  onRendered?: () => void
  refreshKey: number
}

export function RecentTickets(props: RecentAnsweredTicketsProps) {
  const { onOpenAll, onOpenTicket, onRendered, refreshKey } = props
  const { t } = useTranslation()
  const query = useRecentTickets()
  const { refetch } = query
  const tickets = query.data?.content ?? []

  useEffect(() => {
    if (refreshKey === 0) return
    void refetch()
  }, [refetch, refreshKey])

  useEffect(() => {
    if (query.isLoading || query.isFetching) return

    onRendered?.()
  }, [onRendered, query.isFetching, query.isLoading])

  if (
    !query.isLoading &&
    !query.isError &&
    !query.isFetching &&
    tickets.length === 0
  ) {
    return null
  }

  return (
    <section
      aria-labelledby='recent-answered-tickets-title'
      className='rounded-xl border border-slate-200/80 bg-white/65 p-2.5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]'
    >
      <div className='mb-2 flex items-center justify-between gap-2 px-0.5'>
        <h3
          id='recent-answered-tickets-title'
          className='text-sm font-semibold text-slate-900 dark:text-slate-50'
        >
          {t('supportFlow.tickets.recentAnswered')}
        </h3>
        <Button
          presentation='reference'
          type='button'
          variant='ghost'
          size='xs'
          className='h-7 cursor-pointer gap-1 px-2 text-sky-700 hover:bg-sky-100/50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300'
          onClick={onOpenAll}
        >
          {t('supportFlow.tickets.viewAll')}
          <ArrowRight className='size-3.5 rtl:rotate-180' aria-hidden='true' />
        </Button>
      </div>

      {query.isLoading || query.isFetching ? <RecentTicketsSkeleton /> : null}

      {query.isError ? (
        <div
          role='alert'
          className='border-destructive/20 bg-destructive/5 text-destructive flex min-h-16 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs'
        >
          <span>{t('supportFlow.tickets.errors.recent')}</span>
          <Button
            presentation='reference'
            type='button'
            variant='ghost'
            size='xs'
            className='focus-visible:ring-destructive shrink-0 cursor-pointer focus-visible:ring-2'
            onClick={() => query.refetch()}
          >
            <RefreshCw className='size-3.5' aria-hidden='true' />
            {t('supportFlow.tickets.retry')}
          </Button>
        </div>
      ) : null}

      {tickets.length > 0 && !query.isFetching ? (
        <div className='space-y-2'>
          {tickets.map((ticket) =>
            ticket.id ? (
              <div key={ticket.id} className='h-[64px]'>
                <SupportTicketItem ticket={ticket} onSelect={onOpenTicket} />
              </div>
            ) : null
          )}
        </div>
      ) : null}
    </section>
  )
}

function RecentTicketsSkeleton() {
  return (
    <div className='space-y-2' aria-hidden='true'>
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className='h-[64px] rounded-lg border border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]'
        >
          <Skeleton className='h-3.5 w-2/3 bg-gray-200 motion-reduce:animate-pulse' />
          <Skeleton className='mt-3 h-3 w-4/5 bg-gray-200 motion-reduce:animate-pulse' />
        </div>
      ))}
    </div>
  )
}
