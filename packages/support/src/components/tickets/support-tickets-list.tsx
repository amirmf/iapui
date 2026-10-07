import { memo, useCallback, useEffect, useMemo, useRef } from 'react'

import { type SupportTicket } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { Skeleton } from '@iap/ui'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  List,
  type ListImperativeAPI,
  type RowComponentProps,
} from 'react-window'

import { useElementSize } from '../../hooks/use-element-size'
import { useInfiniteMyTickets } from '../../queries/use-support-tickets'
import { SupportTicketItem } from './support-ticket-item'

const TICKET_ROW_HEIGHT = 74
const LOAD_MORE_THRESHOLD = 4

type SupportTicketsListProps = {
  initialScrollOffset: number
  onBack: () => void
  onOpenTicket: (ticketId: string, scrollOffset: number) => void
}

export function SupportTicketsList(props: SupportTicketsListProps) {
  const { initialScrollOffset, onBack, onOpenTicket } = props
  const { t } = useTranslation()
  const listRef = useRef<ListImperativeAPI>(null)
  const didRestoreScrollRef = useRef(false)
  const requestedPageCountRef = useRef(0)
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
    tickets,
  } = useInfiniteMyTickets()
  const pagesLength = data?.pages.length ?? 0

  const selectTicket = useCallback(
    (ticketId: string) => {
      onOpenTicket(ticketId, listRef.current?.element?.scrollTop ?? 0)
    },
    [onOpenTicket]
  )

  const retryNextPage = useCallback(() => {
    requestedPageCountRef.current = pagesLength
    void fetchNextPage()
  }, [fetchNextPage, pagesLength])

  const rowProps = useMemo<SupportTicketListRowProps>(
    () => ({
      hasNextPage: Boolean(hasNextPage),
      isFetchingNextPage,
      isNextPageError: isFetchNextPageError,
      onRetryNextPage: retryNextPage,
      onSelect: selectTicket,
      tickets,
    }),
    [
      hasNextPage,
      isFetchNextPageError,
      isFetchingNextPage,
      retryNextPage,
      selectTicket,
      tickets,
    ]
  )

  const handleRowsRendered = useCallback(
    (
      _visibleRows: { startIndex: number; stopIndex: number },
      allRows: { startIndex: number; stopIndex: number }
    ) => {
      const shouldLoad =
        allRows.stopIndex >= tickets.length - LOAD_MORE_THRESHOLD
      const nextRequestedPageCount = pagesLength + 1

      if (
        shouldLoad &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isFetchNextPageError &&
        requestedPageCountRef.current < nextRequestedPageCount
      ) {
        requestedPageCountRef.current = nextRequestedPageCount
        void fetchNextPage()
      }
    },
    [
      fetchNextPage,
      hasNextPage,
      isFetchNextPageError,
      isFetchingNextPage,
      pagesLength,
      tickets.length,
    ]
  )

  useEffect(() => {
    if (
      didRestoreScrollRef.current ||
      size.height === 0 ||
      tickets.length === 0
    ) {
      return
    }

    const element = listRef.current?.element
    if (!element) return

    element.scrollTo({ top: initialScrollOffset })
    didRestoreScrollRef.current = true
  }, [initialScrollOffset, size.height, tickets.length])

  const rowCount = tickets.length + 1

  return (
    <div className='relative z-10 flex min-h-0 flex-1 flex-col'>
      <div className='flex shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/80 px-3 py-2.5 backdrop-blur-xl sm:px-4 dark:border-white/10 dark:bg-slate-950/80'>
        <Button
          presentation='reference'
          type='button'
          variant='ghost'
          size='icon'
          className='size-9 cursor-pointer rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-200'
          onClick={onBack}
          aria-label={t('supportFlow.tickets.backToChat')}
        >
          <ArrowLeft className='size-4 rtl:rotate-180' aria-hidden='true' />
        </Button>
        <div className='min-w-0'>
          <h3 className='truncate text-sm font-semibold text-slate-950 dark:text-slate-50'>
            {t('supportFlow.tickets.myTickets')}
          </h3>
          <p className='truncate text-xs text-slate-500 dark:text-slate-400'>
            {t('supportFlow.tickets.listDescription')}
          </p>
        </div>
        <Button
          presentation='reference'
          type='button'
          variant='ghost'
          size='icon'
          className='ms-auto size-9 cursor-pointer rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-200'
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label={t('supportFlow.tickets.refresh')}
        >
          <RefreshCw
            className={cn('size-4', isFetching && 'animate-spin')}
            aria-hidden='true'
          />
        </Button>
      </div>

      <div className='min-h-0 flex-1 p-3 sm:p-4'>
        <div ref={containerRef} className='h-full min-h-0'>
          {isLoading || isFetching || size.height === 0 ? (
            <TicketsListSkeleton />
          ) : null}

          {isError && !data ? (
            <TicketListState
              message={t('supportFlow.tickets.errors.list')}
              onRetry={() => refetch()}
            />
          ) : null}

          {!isLoading && !isError && tickets.length === 0 ? (
            <TicketListState message={t('supportFlow.tickets.noTickets')} />
          ) : null}

          {size.height > 0 && tickets.length > 0 && !isFetching ? (
            <List
              aria-label={t('supportFlow.tickets.listLabel')}
              className='[scrollbar-width:thin]'
              defaultHeight={size.height}
              listRef={listRef}
              onRowsRendered={handleRowsRendered}
              overscanCount={4}
              rowComponent={SupportTicketListRow}
              rowCount={rowCount}
              rowHeight={TICKET_ROW_HEIGHT}
              rowProps={rowProps}
              style={{ height: size.height, width: '100%' }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

type SupportTicketListRowProps = {
  tickets: SupportTicket[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isNextPageError: boolean
  onRetryNextPage: () => void
  onSelect: (ticketId: string) => void
}

function SupportTicketListRow(
  props: RowComponentProps<SupportTicketListRowProps>
) {
  return <MemoizedSupportTicketListRow {...props} />
}

const MemoizedSupportTicketListRow = memo(function SupportTicketListRow(
  props: RowComponentProps<SupportTicketListRowProps>
) {
  const {
    ariaAttributes,
    hasNextPage,
    index,
    isFetchingNextPage,
    isNextPageError,
    onRetryNextPage,
    onSelect,
    style,
    tickets,
  } = props
  const { t } = useTranslation()
  const ticket = tickets[index]

  if (!ticket) {
    return (
      <div {...ariaAttributes} style={style} className='py-1.5'>
        <div className='flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 px-3 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400'>
          {isNextPageError ? (
            <div role='alert' className='flex flex-col items-center gap-2'>
              <span>{t('supportFlow.tickets.failedToLoadMore')}</span>
              <Button
                presentation='reference'
                type='button'
                variant='outline'
                size='xs'
                className='cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500'
                onClick={onRetryNextPage}
              >
                <RefreshCw className='size-3.5' aria-hidden='true' />
                {t('supportFlow.tickets.retry')}
              </Button>
            </div>
          ) : isFetchingNextPage || hasNextPage ? (
            <span className='flex items-center gap-2'>
              <Loader2 className='size-4 animate-spin' aria-hidden='true' />
              {t('supportFlow.tickets.loadingMore')}
            </span>
          ) : (
            t('supportFlow.tickets.endOfTickets')
          )}
        </div>
      </div>
    )
  }

  return (
    <div {...ariaAttributes} style={style} className='py-1.5'>
      <SupportTicketItem ticket={ticket} onSelect={onSelect} />
    </div>
  )
})

function TicketsListSkeleton() {
  return (
    <div className='space-y-3' aria-hidden='true'>
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className='h-[74px] rounded-xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]'
        >
          <Skeleton className='h-4 w-3/5 bg-gray-200 motion-reduce:animate-pulse' />
          <Skeleton className='mt-4 h-3 w-4/5 bg-gray-200 motion-reduce:animate-pulse' />
        </div>
      ))}
    </div>
  )
}

function TicketListState(props: { message: string; onRetry?: () => void }) {
  const { message, onRetry } = props
  const { t } = useTranslation()

  return (
    <div
      className='flex h-full min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white/55 px-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400'
      role={onRetry ? 'alert' : undefined}
    >
      <p>{message}</p>
      {onRetry ? (
        <Button
          presentation='reference'
          type='button'
          variant='outline'
          size='sm'
          className='cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500'
          onClick={onRetry}
        >
          <RefreshCw className='size-4' aria-hidden='true' />
          {t('supportFlow.tickets.retry')}
        </Button>
      ) : null}
    </div>
  )
}
