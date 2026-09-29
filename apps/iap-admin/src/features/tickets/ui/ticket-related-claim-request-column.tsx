import { ReadonlyAssessmentItems } from '@features/assessment-items'
import { claimRequestService } from '@features/claim-requests'
import type { SupportTicket } from '@iap/api-types'
import { Badge, Button } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
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
  const claimRequestId = ticket?.claimRequestId?.trim()
  const claimRequestQuery = useQuery({
    enabled: isOpen && Boolean(claimRequestId),
    queryFn: ({ signal }) =>
      claimRequestService.findById(claimRequestId!, signal),
    queryKey: ['claimRequest', claimRequestId],
  })

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
          <div className='space-y-2 text-sm'>
            <p>{claimRequestQuery.data.extDisplayName ?? '-'}</p>
            <Badge variant='outline'>
              {claimRequestQuery.data.status ?? '-'}
            </Badge>
          </div>
          <section aria-labelledby='ticket-related-assessment-items-title'>
            <div className='mb-3 flex items-center justify-between gap-2'>
              <h4
                className='font-medium'
                id='ticket-related-assessment-items-title'
              >
                {t('tickets.relatedClaimRequest.assessmentItems')}
              </h4>
              <Button asChild size='sm' variant='secondary'>
                <a
                  href={`/claim-requests/${claimRequestId}/claim-request-management/`}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <ExternalLink aria-hidden='true' size={14} />
                  <span>{t('tickets.detail.openClaimRequest')}</span>
                </a>
              </Button>
            </div>
            <ReadonlyAssessmentItems
              claimRequestId={claimRequestId}
              enabled={isOpen}
            />
          </section>
        </>
      ) : null}
    </section>
  )
}
