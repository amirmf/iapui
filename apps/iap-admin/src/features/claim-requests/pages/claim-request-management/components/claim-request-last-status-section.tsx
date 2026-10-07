import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  MY_IAP_SENT_TO_BANK_FILTER_VALUE,
  claimStatusColors,
} from '@features/claim-requests/constants/claim-request-status'
import {
  getClaimRequestDisplayStatus,
  getClaimRequestDisplayStatusColor,
} from '@features/claim-requests/model/claim-request-display-status'
import { ClaimRequestStatusHistoryDialog } from '@features/claim-requests/pages/claim-request-management/components/claim-request-status-history-dialog'
import {
  type ClaimRequestStatus,
  type statusHistoryItemType,
} from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface ClaimRequestLastStatusSectionProps {
  statusHistory?: statusHistoryItemType[]
  status?: ClaimRequestStatus | null
  extPaymentDate?: string | null
}

function ClaimRequestLastStatusSection(
  props: ClaimRequestLastStatusSectionProps
) {
  const { statusHistory, status, extPaymentDate } = props
  const { t } = useTranslate()

  const lastStatus = statusHistory?.length
    ? statusHistory[statusHistory.length - 1]?.status
    : undefined
  const displayedStatus = getClaimRequestDisplayStatus({
    status: status ?? lastStatus,
    extPaymentDate,
  })
  const statusColor = getClaimRequestDisplayStatusColor(displayedStatus)
  const statusColorClass = statusColor
    ? claimStatusColors[statusColor]
    : undefined
  const statusTranslationKey = statusColor
    ? CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[statusColor]
    : undefined
  return (
    <div className='flex items-center'>
      <p className='pe-1 text-center text-xs font-medium text-muted-foreground'>
        {t('claimRequests.statusHistory.systemStatus')}:
      </p>
      <ClaimRequestStatusHistoryDialog
        statusHistory={statusHistory?.concat([])?.reverse()}
        status={status}
        extPaymentDate={extPaymentDate}
      >
        <Badge
          presentation='reference'
          asChild
          variant='outline'
          className={cn('w-fit capitalize', statusColorClass)}
        >
          <button type='button' disabled={!statusHistory?.length}>
            {displayedStatus === MY_IAP_SENT_TO_BANK_FILTER_VALUE
              ? t('claimRequests.status.sentToBank')
              : statusTranslationKey
                ? t(statusTranslationKey)
                : '-'}
          </button>
        </Badge>
      </ClaimRequestStatusHistoryDialog>
    </div>
  )
}

export default ClaimRequestLastStatusSection
