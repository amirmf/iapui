# Task 03 — Customer User Summary and Utils

## Objective
Implement missing reference component `CustomerUserClaimRequestSummary` and ensure `customer-user-claim-routes.ts` is available at `features/customer-user/utils/customer-user-claim-routes.ts`.

## Reference Inspection
File: `insurance-ui/src/features/customer-user/components/customer-user-claim-request-summary.tsx`
```tsx
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClaimRequest } from '@/features/claim-requests/data/claim-request-schema'

interface CustomerUserClaimRequestSummaryProps {
  claimRequest: ClaimRequest
}

export function CustomerUserClaimRequestSummary({
  claimRequest,
}: CustomerUserClaimRequestSummaryProps) {
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
```

## Action Items
1. Create `apps/iap-admin/src/features/customer-user/components/customer-user-claim-request-summary.tsx`.
2. Provide `apps/iap-admin/src/features/customer-user/utils/customer-user-claim-routes.ts`.
3. Export both in `apps/iap-admin/src/features/customer-user/index.ts`.
