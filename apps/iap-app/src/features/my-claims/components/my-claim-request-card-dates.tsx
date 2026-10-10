import { myIapFindTimeStamp } from '@features/my-claims/utils/utils'
import type { ClaimRequest } from '@iap/api-types'
import { formatDate } from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function MyClaimRequestCardDates(props: { claim: ClaimRequest }) {
  const { claim } = props
  const { t, i18n } = useTranslation()
  const statusTimeStamps = myIapFindTimeStamp(claim.statusHistory)
  const formatClaimDate = (date: string | Date | null | undefined) =>
    formatDate(date, undefined, {
      language: i18n.language,
      normalizeTimezone: false,
      invalidDate: 'throw',
    })

  return (
    <>
      <div className='mt-1 flex justify-between'>
        <p className='text-xs font-medium'>
          <span className='text-muted-foreground'>
            {t('myiap.claimRequest.detail.submitDate')}:{' '}
          </span>
          <span>{formatClaimDate(claim.submitDate)}</span>
        </p>
        <p className='text-xs font-medium'>
          <span className='text-muted-foreground'>
            {t('myiap.claimRequest.detail.createdAt')}:{' '}
          </span>
          <span>{formatClaimDate(claim.createdAt)}</span>
        </p>
      </div>
      {(statusTimeStamps.statusApproved ||
        (statusTimeStamps.statusPaid && claim.status === 'PAID') ||
        (claim.extPaymentDate && claim.status === 'PAID') ||
        (statusTimeStamps.statusReturn && claim.status === 'RETURN')) && (
        <div className='mt-1 flex justify-between'>
          {statusTimeStamps.statusApproved && (
            <p className='text-xs font-medium'>
              <span className='text-muted-foreground'>
                {t('myiap.claimRequest.detail.approvedAt')}:{' '}
              </span>
              <span>{formatClaimDate(statusTimeStamps.statusApproved)}</span>
            </p>
          )}
          {statusTimeStamps.statusPaid && claim.status === 'PAID' && (
            <p className='text-xs font-medium'>
              <span className='text-muted-foreground'>
                {t('myiap.claimRequest.detail.paidAt')}:{' '}
              </span>
              <span>{formatClaimDate(statusTimeStamps.statusPaid)}</span>
            </p>
          )}
          {claim.extPaymentDate && claim.status === 'PAID' && (
            <p className='text-xs font-medium'>
              <span className='text-muted-foreground'>
                {t('myiap.claimRequest.detail.extPaymentDate')}:{' '}
              </span>
              <span>{claim.extPaymentDate}</span>
            </p>
          )}
          {statusTimeStamps.statusReturn && claim.status === 'RETURN' && (
            <p className='text-xs font-medium'>
              <span className='text-muted-foreground'>
                {t('myiap.claimRequest.detail.returnedAt')}:{' '}
              </span>
              <span>{formatClaimDate(statusTimeStamps.statusReturn)}</span>
            </p>
          )}
        </div>
      )}
    </>
  )
}
