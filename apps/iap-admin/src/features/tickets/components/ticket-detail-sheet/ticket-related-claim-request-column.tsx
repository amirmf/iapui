import {
  AssessmentItemsCardList,
  useAssessmentItemsData,
} from '@features/assessment-items'
import { ClaimRequestReadonlyInfoList } from '@features/claim-requests'
import { ticketRelatedClaimRequestQueryOptions } from '@features/tickets/queries/ticket-related-claim-request-query'
import type { SupportTicket } from '@iap/api-types'
import { Button } from '@iap/ui'
import { IconExternalLink } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

type TicketRelatedClaimRequestColumnProps = {
  isOpen: boolean
  ticket?: SupportTicket
}

export function TicketRelatedClaimRequestColumn(
  props: TicketRelatedClaimRequestColumnProps
) {
  const { isOpen, ticket } = props
  const { t } = useTranslation()
  const claimRequestId = ticket?.claimRequestId?.trim() || undefined
  const claimRequestQuery = useQuery(
    ticketRelatedClaimRequestQueryOptions(claimRequestId, isOpen)
  )
  const assessmentClaimRequestId = isOpen ? claimRequestId : undefined
  const assessmentItemsQuery = useAssessmentItemsData(assessmentClaimRequestId)

  return (
    <section
      aria-labelledby='ticket-related-claim-request-title'
      className='flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto rounded-lg border bg-muted/20 p-4 lg:order-1 lg:rtl:order-2'
    >
      <h3
        className='text-sm font-semibold text-muted-foreground'
        id='ticket-related-claim-request-title'
      >
        {t('tickets.relatedClaimRequest.title')}
      </h3>
      {!claimRequestId ? (
        <p className='text-sm text-muted-foreground'>
          {t('tickets.relatedClaimRequest.unavailable')}
        </p>
      ) : null}
      {claimRequestId && claimRequestQuery.isLoading ? (
        <p
          aria-live='polite'
          className='text-sm text-muted-foreground'
          role='status'
        >
          {t('tickets.relatedClaimRequest.loading')}
        </p>
      ) : null}
      {claimRequestId && claimRequestQuery.isError ? (
        <p className='text-sm text-destructive' role='alert'>
          {t('tickets.relatedClaimRequest.error')}
        </p>
      ) : null}
      {claimRequestId &&
      !claimRequestQuery.isLoading &&
      !claimRequestQuery.isError &&
      !claimRequestQuery.data ? (
        <p className='text-sm text-muted-foreground'>
          {t('tickets.relatedClaimRequest.empty')}
        </p>
      ) : null}
      {claimRequestQuery.data ? (
        <>
          <ClaimRequestReadonlyInfoList data={claimRequestQuery.data} />
          <section
            aria-labelledby='ticket-related-assessment-items-title'
            className='min-w-0'
          >
            <div className='mb-3 flex items-center justify-between gap-2'>
              <h4
                className='font-medium'
                id='ticket-related-assessment-items-title'
              >
                {t('tickets.relatedClaimRequest.assessmentItems')}
              </h4>
              <Button
                presentation='reference'
                asChild
                size='xs'
                variant='secondary'
              >
                <a
                  href={`/claim-requests/${claimRequestId}/claim-request-management/`}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <IconExternalLink aria-hidden='true' size={12} />
                  <span>{t('tickets.detail.openClaimRequest')}</span>
                </a>
              </Button>
            </div>
            {!assessmentClaimRequestId ? (
              <p className='text-sm text-muted-foreground'>
                {t('tickets.relatedClaimRequest.assessmentItemsUnavailable')}
              </p>
            ) : assessmentItemsQuery.isError ? (
              <p className='text-sm text-destructive'>
                {t('tickets.relatedClaimRequest.assessmentItemsError')}
              </p>
            ) : (
              <AssessmentItemsCardList
                claimRequest={claimRequestQuery.data}
                claimRequestId={assessmentClaimRequestId}
                isLoading={assessmentItemsQuery.isLoading}
                items={assessmentItemsQuery.data}
                mode='readonly'
                showEmptyMessage
              />
            )}
          </section>
        </>
      ) : null}
    </section>
  )
}
