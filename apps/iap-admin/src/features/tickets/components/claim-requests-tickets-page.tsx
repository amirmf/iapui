import { useCallback } from 'react'

import {
  CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS,
  type ClaimRequestQuickStatus,
  ClaimRequestStatusFilter,
} from '@features/claim-requests'
import { TicketsContent } from '@features/tickets/components/tickets-content'
import { TicketProvider } from '@features/tickets/context/provider/ticket-provider'
import { toClaimRequestsSearch } from '@features/tickets/route-adapters/claim-request-navigation'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function ClaimRequestsTicketsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const handleQuickStatusChange = useCallback(
    (status: ClaimRequestQuickStatus) => {
      if (status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS) return

      router.navigate({
        replace: true,
        search: toClaimRequestsSearch(status) as never,
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
            <ClaimRequestStatusFilter
              isLoading={false}
              onStatusChange={handleQuickStatusChange}
              selectedStatus={CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS}
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
