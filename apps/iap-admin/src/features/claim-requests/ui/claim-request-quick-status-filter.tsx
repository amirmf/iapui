import { cn } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import { claimRequestStatusTranslationKeys } from '../constants/claim-request-status'
import { CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS } from '../model/claim-request-feature'
import {
  type ClaimRequestQuickStatus,
  claimRequestQuickStatuses,
} from '../model/claim-request-filters'

export function ClaimRequestQuickStatusFilter(props: {
  count?: number
  isFetching: boolean
  onStatusChange: (status: ClaimRequestQuickStatus) => void
  selectedStatus: ClaimRequestQuickStatus
}) {
  const { count, isFetching, onStatusChange, selectedStatus } = props
  const { t } = useTranslation()

  return (
    <div className='grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10'>
      {claimRequestQuickStatuses.map((status) => (
        <button
          aria-pressed={selectedStatus === status}
          className={cn(
            'min-h-11 rounded-md bg-muted px-2 py-1.5 text-xs transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
            selectedStatus === status &&
              'bg-primary font-medium text-primary-foreground hover:bg-primary/90'
          )}
          key={status}
          onClick={() => onStatusChange(status)}
          type='button'
        >
          <span className='block'>
            {status === 'ALL'
              ? t('common.all')
              : status === CLAIM_REQUEST_TICKET_FEATURE_QUICK_STATUS
                ? t('claimRequests.status.needsReassessment')
                : t(claimRequestStatusTranslationKeys[status] as never)}
          </span>
          <span
            aria-live={selectedStatus === status ? 'polite' : undefined}
            className='block tabular-nums'
          >
            {selectedStatus === status && !isFetching ? `(${count ?? 0})` : '–'}
          </span>
        </button>
      ))}
    </div>
  )
}
