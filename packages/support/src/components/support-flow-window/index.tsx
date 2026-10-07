import { useCallback, useEffect, useRef, useState } from 'react'

import { useAuthSession } from '@iap/auth'
import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import type { SupportFlowColorContext } from '../support-flow-types'
import { RecentTickets } from '../tickets/recent-tickets'
import { SupportTicketDetails } from '../tickets/support-ticket-details'
import { SupportTicketsList } from '../tickets/support-tickets-list'
import { SupportFlowMessage } from './support-flow-message'
import { SupportFlowUserMessage } from './support-flow-user-message'
import SupportFlowWindowActions from './support-flow-window-actions'
import SupportFlowWindowError from './support-flow-window-error'
import SupportFlowWindowHeader from './support-flow-window-header'
import SupportFlowWindowLoading from './support-flow-window-loading'
import { SupportOptionList } from './support-option-list'
import { SupportTextInput } from './support-text-input'
import { useSupportFlow } from './use-support-flow'

type SupportWindowView =
  | { type: 'chat' }
  | { type: 'tickets' }
  | {
      type: 'ticket-details'
      ticketId: string
      returnTo: 'chat' | 'tickets'
    }

type SupportFlowWindowProps = {
  colorContext?: SupportFlowColorContext
}

export function SupportFlowWindow(props: SupportFlowWindowProps) {
  const { colorContext = 'default' } = props
  const { t: translation } = useTranslation()
  const t = translation as unknown as (key: string) => string
  const { isAuthenticated } = useAuthSession()
  const ticketListScrollOffsetRef = useRef(0)
  const [view, setView] = useState<SupportWindowView>({ type: 'chat' })
  const [recentTicketsRefreshKey, setRecentTicketsRefreshKey] = useState(0)
  const [renderedRecentTicketsKey, setRenderedRecentTicketsKey] = useState<
    number | null
  >(null)
  const {
    isOpen,
    currentStep,
    currentResponse,
    isLoading,
    isLoadingMoreOptions,
    isMyIap,
    isTextInput,
    listItems,
    canGoBack,
    closeSupport,
    resetFlow,
    goBack,
    selectOption,
    submitText,
    loadMoreOptions,
  } = useSupportFlow()

  // useEffect(() => {
  //   if (view.type !== 'chat') return
  // scrollRef.current?.scrollTo({
  //   top: scrollRef.current.scrollHeight,
  //   behavior: 'smooth',
  // })
  // }, [currentStep.id, currentStep.message, isLoading, error, view.type])

  useEffect(() => {
    if (!isOpen) return
    const htmlTag = document.documentElement

    const updateBodyScroll = () => {
      if (window.innerWidth < 768) {
        htmlTag.style.setProperty('overflow', 'hidden')
      } else {
        htmlTag.style.removeProperty('overflow')
      }
    }

    updateBodyScroll()
    window.addEventListener('resize', updateBodyScroll)

    return () => {
      window.removeEventListener('resize', updateBodyScroll)
      htmlTag.style.removeProperty('overflow')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setRenderedRecentTicketsKey(null)
  }, [isOpen])

  const openListTicket = useCallback(
    (ticketId: string, scrollOffset: number) => {
      ticketListScrollOffsetRef.current = scrollOffset
      setView({ type: 'ticket-details', ticketId, returnTo: 'tickets' })
    },
    []
  )

  const onRendered = useCallback(() => {
    setRenderedRecentTicketsKey(recentTicketsRefreshKey)
  }, [recentTicketsRefreshKey])

  if (!isOpen) return null

  const showOptions = Boolean(listItems.length)
  const handleClose = () => {
    setView({ type: 'chat' })
    ticketListScrollOffsetRef.current = 0
    setRenderedRecentTicketsKey(null)
    closeSupport()
  }
  const openTickets = () => setView({ type: 'tickets' })
  const handleRestart = () => {
    resetFlow()
    setRenderedRecentTicketsKey(null)
    setRecentTicketsRefreshKey((key) => key + 1)
  }
  const handleBack = () => {
    setRenderedRecentTicketsKey(null)
    goBack()
  }
  const returnToChat = () => {
    setRenderedRecentTicketsKey(null)
    setView({ type: 'chat' })
  }
  const openRecentTicket = (ticketId: string) =>
    setView({ type: 'ticket-details', ticketId, returnTo: 'chat' })
  const backFromTicketDetails = () => {
    if (view.type !== 'ticket-details') return
    if (view.returnTo === 'chat') {
      returnToChat()
      return
    }

    setView({ type: view.returnTo })
  }

  return (
    <section
      role='dialog'
      aria-modal='true'
      aria-labelledby='support-flow-title'
      className={cn(
        'animate-in fade-in-0 zoom-in-95 fixed z-50 flex overflow-hidden border border-slate-200/80 bg-white shadow-[0_30px_100px_-28px_rgb(15_23_42/0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950',
        'top-0 right-0 bottom-0 left-0 h-[100dvh] w-screen rounded-none md:inset-auto md:bottom-6 md:left-6 md:h-[min(760px,calc(100dvh-3rem))] md:w-[min(460px,calc(100vw-3rem))] md:rounded-[2rem]'
      )}
    >
      <div className='relative flex min-h-0 w-full flex-col'>
        <div
          className='pointer-events-none absolute top-0 right-0 bottom-0 left-0 bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.14),transparent_32%),radial-gradient(circle_at_100%_10%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.72)_42%,rgba(255,255,255,0.96))] dark:bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_100%_10%,rgba(20,184,166,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))]'
          aria-hidden='true'
        />
        <SupportFlowWindowHeader
          colorContext={colorContext}
          onClose={handleClose}
        />

        {view.type === 'chat' ? (
          <>
            <SupportFlowWindowActions
              canGoBack={canGoBack}
              isLoading={isLoading}
              onBack={handleBack}
              onReset={handleRestart}
            />
            <SupportFlowUserMessage
              parametersContext={currentResponse?.parametersContext}
            />

            <div
              // ref={scrollRef}
              className='relative flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden px-3 py-4 [scrollbar-width:thin] sm:px-4 sm:py-5 md:px-5 md:pb-5'
            >
              {isAuthenticated && isMyIap && !canGoBack ? (
                <RecentTickets
                  onOpenAll={openTickets}
                  onOpenTicket={openRecentTicket}
                  onRendered={onRendered}
                  refreshKey={recentTicketsRefreshKey}
                />
              ) : null}

              <SupportFlowMessage message={currentStep.message} />

              <SupportFlowWindowLoading />
              <SupportFlowWindowError />

              {!isLoading &&
              showOptions &&
              (!isMyIap ||
                !isAuthenticated ||
                canGoBack ||
                renderedRecentTicketsKey === recentTicketsRefreshKey) ? (
                <SupportOptionList
                  options={listItems}
                  disabled={isLoading}
                  hasMoreOptions={Boolean(
                    currentResponse?.response?.options &&
                    !currentResponse.response.options.last
                  )}
                  isLoadingMoreOptions={isLoadingMoreOptions}
                  onLoadMore={loadMoreOptions}
                  onSelect={selectOption}
                />
              ) : null}
            </div>

            {isTextInput ? (
              <SupportTextInput
                placeholder={t(
                  currentStep.placeholderKey ?? 'supportFlow.input.placeholder'
                )}
                disabled={isLoading}
                onSubmit={submitText}
              />
            ) : null}
          </>
        ) : null}

        {view.type === 'tickets' ? (
          <SupportTicketsList
            initialScrollOffset={ticketListScrollOffsetRef.current}
            onBack={returnToChat}
            onOpenTicket={openListTicket}
          />
        ) : null}

        {view.type === 'ticket-details' ? (
          <SupportTicketDetails
            ticketId={view.ticketId}
            onBack={backFromTicketDetails}
          />
        ) : null}
      </div>
    </section>
  )
}
