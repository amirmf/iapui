import { useCallback } from 'react'

import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
  type ClaimRequestQuickStatus,
  ClaimRequestQuickStatusFilter,
} from '@features/claim-requests'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { TicketProvider } from '../context/provider/ticket-provider'
import { TicketsContent } from './tickets-content'

export function ClaimRequestsTicketsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const handleQuickStatusChange = useCallback(
    (status: ClaimRequestQuickStatus) => {
      if (status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS) return

      router.navigate({
        replace: true,
        search: {
          [CLAIM_REQUEST_FEATURE_QUERY_KEY]:
            CLAIM_REQUEST_FEATURES.claimRequests,
          quickStatus: status,
        } as never,
        to: './',
      })
    },
    [router]
  )

  return (
    <TicketProvider>
      <TicketsContent
        beforeStatusFilter={
          <div className='mb-4'>
            <ClaimRequestQuickStatusFilter
              isFetching={false}
              onQuickStatusChange={handleQuickStatusChange}
              quickStatus={CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS}
            />
          </div>
        }
        ticketColumnsVariant='claim-request-context'
        ticketStatusFilterVariant='claim-request-context'
        title={t('claimRequests.status.needsReassessment')}
      />
    </TicketProvider>
  )
}
