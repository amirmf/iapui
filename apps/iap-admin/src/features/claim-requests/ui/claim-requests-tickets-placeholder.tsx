import { Button } from '@iap/ui'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import {
  CLAIM_REQUEST_FEATURES,
  CLAIM_REQUEST_FEATURE_QUERY_KEY,
} from '../model/claim-request-feature'

/** Placeholder until the tickets feature is migrated to iap-admin. */
export function ClaimRequestsTicketsPlaceholder() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <section>
      <h1 className='mb-4 text-2xl font-bold tracking-tight'>
        {t('claimRequests.status.needsReassessment')}
      </h1>
      <p className='mb-4 text-sm text-muted-foreground'>
        {t('placeholder.description')}
      </p>
      <Button
        onClick={() =>
          router.navigate({
            replace: true,
            search: {
              [CLAIM_REQUEST_FEATURE_QUERY_KEY]:
                CLAIM_REQUEST_FEATURES.claimRequests,
            } as never,
            to: './',
          })
        }
        variant='outline'
      >
        {t('claimRequests.title')}
      </Button>
    </section>
  )
}
