import type { ClaimRequest } from '@iap/api-types'
import { Card, CardContent, CardHeader, CardTitle } from '@iap/ui'
import { useTranslation } from 'react-i18next'

interface CustomerUserClaimRequestSummaryProps {
  claimRequest: ClaimRequest
}

export function CustomerUserClaimRequestSummary(
  props: CustomerUserClaimRequestSummaryProps
) {
  const { claimRequest } = props
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customerUser.claimRequests.detail.title')}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 text-sm sm:grid-cols-2'>
        <div>
          <p className='text-muted-foreground'>
            {t('customerUser.claimRequests.fields.policyNumber')}
          </p>
          <p className='font-medium'>{claimRequest.extPolicyFullNo ?? '-'}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>
            {t('customerUser.claimRequests.fields.status')}
          </p>
          <p className='font-medium'>{claimRequest.status ?? '-'}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>
            {t('customerUser.claimRequests.fields.submitDate')}
          </p>
          <p className='font-medium'>{claimRequest.submitDate ?? '-'}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>
            {t('customerUser.claimRequests.fields.amount')}
          </p>
          <p className='font-medium'>{claimRequest.amount ?? '-'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
