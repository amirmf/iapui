import styles from '@features/agent-claim-requests/pages/detail/agent-claim-requests-detail-page.module.css'
import AgentClaimRequestDetailInfoList from '@features/agent-claim-requests/pages/detail/components/agent-claim-request-detail-info-list'
import AgentClaimRequestDetailResult from '@features/agent-claim-requests/pages/detail/components/agent-claim-request-detail-result'
import useGetAgentClaimRequestById from '@features/agent-claim-requests/pages/detail/queries/use-get-agent-claim-request-by-id'
import { extractErrorMessage } from '@iap/api-client'
import type { Attachment } from '@iap/api-types'
import { Alert, AlertDescription, AlertTitle, cn } from '@iap/ui'
import { FileViewer } from '@modules/files'
import { useTranslation } from 'react-i18next'

export function AgentClaimRequestsDetailPage() {
  const { t } = useTranslation()
  const {
    data: claimData,
    error,
    isError,
    isLoading,
  } = useGetAgentClaimRequestById()

  const attachments: Attachment[] = Array.isArray(claimData?.attachments)
    ? (claimData.attachments as Attachment[])
    : []

  return (
    <div className={cn('container max-w-3xl pb-6', styles.page)}>
      {isError && (
        <Alert variant='destructive'>
          <AlertTitle>{t('errors.general.heading')}</AlertTitle>
          <AlertDescription>
            {extractErrorMessage(error, { presentation: 'reference' }) ||
              t('errors.general.description')}
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
            <AgentClaimRequestDetailInfoList />
            <AgentClaimRequestDetailResult />
            {attachments.length > 0 && (
              <div className='pt-2'>
                <FileViewer attachments={attachments} />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AgentClaimRequestsDetailPage
