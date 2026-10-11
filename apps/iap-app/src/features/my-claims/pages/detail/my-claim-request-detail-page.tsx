import { MyClaimRequestPageHeader } from '@features/my-claims/components/my-claim-request-page-header'
import MyClaimRequestDetailActions from '@features/my-claims/pages/detail/components/my-claim-request-detail-actions.tsx'
import MyClaimRequestDetailInfoList from '@features/my-claims/pages/detail/components/my-claim-request-detail-info-list.tsx'
import MyClaimRequestDetailIResult from '@features/my-claims/pages/detail/components/my-claim-request-detailI-result.tsx'
import useGetMyClaimRequestById from '@features/my-claims/pages/detail/queries/use-get-my-claim-request-by-id'
import { extractErrorMessage } from '@iap/api-client'
import type { Attachment } from '@iap/api-types'
import { FileViewer } from '@iap/files'
import { Alert, AlertDescription, AlertTitle } from '@iap/ui'
import { Button } from '@iap/ui'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export default function MyClaimRequestDetailPage() {
  const { t } = useTranslation()
  const {
    data: claimData,
    error,
    isError,
    isLoading,
  } = useGetMyClaimRequestById()

  // Extract attachments from claim data
  const attachments: Attachment[] = Array.isArray(claimData?.attachments)
    ? (claimData.attachments as Attachment[])
    : []

  return (
    <div className='container px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-6'>
        <MyClaimRequestPageHeader
          title={t('claimRequests.actions.viewDetails')}
          showBackButton
        />

        {isError && (
          <Alert variant='destructive'>
            <AlertTitle>{t('errors.general.heading')}</AlertTitle>
            <AlertDescription>
              {extractErrorMessage(error) || t('errors.general.description')}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className='flex items-center justify-center py-12 text-sm text-muted-foreground'>
            {t('common.loading')}
          </div>
        ) : claimData ? (
          <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <div className='space-y-4 text-sm'>
              <MyClaimRequestDetailInfoList />
              <MyClaimRequestDetailActions />
              <MyClaimRequestDetailIResult />
              {attachments.length > 0 && (
                <div className='pt-2'>
                  <FileViewer attachments={attachments} />
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className='flex justify-end'>
          <Button presentation='reference' asChild variant='outline'>
            <Link to='/myclaims/'>
              {t('common.back', { defaultValue: 'Back' })}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
