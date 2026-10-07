import type { CSSProperties } from 'react'

import { useClaimRequestDuplicateTarget } from '@features/claim-requests/pages/claim-request-management/queries/use-claim-request-duplicate-target'
import { useIsAgentPanel } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-is-agent-panel'
import { type ClaimRequest } from '@iap/api-types'
import { type Attachment, attachmentSchema } from '@iap/api-types'
import { Button } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { FileViewer } from '@modules/files'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { IconExternalLink } from '@tabler/icons-react'

type ClaimRequestDuplicate = NonNullable<ClaimRequest['duplicates']>[number]

interface ClaimRequestDuplicateImageDialogProps {
  duplicate: ClaimRequestDuplicate | null
  sourceAttachments: unknown[]
  onOpenChange: (open: boolean) => void
}

interface ClaimRequestDuplicateImageViewerProps {
  attachments: Attachment[]
  title: string
}

const fullHeightViewerStyle: CSSProperties = {
  height: '100%',
  width: '100%',
}

function getTargetClaimRequestHref(
  claimRequestId: string,
  isAgentPanel: boolean
) {
  const prefix = isAgentPanel ? '/agent' : ''
  return `${prefix}/claim-requests/${claimRequestId}/claim-request-management/`
}

function getImageAttachments(attachments: unknown[] | null | undefined) {
  return (attachments ?? []).flatMap((attachment) => {
    const parsedAttachment = attachmentSchema.safeParse(attachment)

    return parsedAttachment.success &&
      parsedAttachment.data.fileType.startsWith('image/')
      ? [parsedAttachment.data]
      : []
  })
}

function ClaimRequestDuplicateImageViewer(
  props: ClaimRequestDuplicateImageViewerProps
) {
  const { attachments, title } = props
  const { t } = useTranslation()

  return (
    <section className='flex min-h-0 flex-1 flex-col'>
      <h3 className='mb-3 shrink-0 text-sm font-semibold'>{title}</h3>
      {attachments.length > 0 ? (
        <FileViewer
          attachments={attachments}
          className='flex min-h-0 flex-1 flex-col'
          docClassName='min-h-0 flex-1'
          imageViewerClassName='flex min-h-0 flex-1 flex-col gap-3 space-y-0'
          imageViewportClassName='min-h-0 flex-1'
          transformComponentWrapperStyle={fullHeightViewerStyle}
        />
      ) : (
        <p className='text-sm text-muted-foreground'>
          {t('claimRequests.duplicateDetails.imageUnavailable')}
        </p>
      )}
    </section>
  )
}

function ClaimRequestDuplicateTargetLink({
  claimRequestId,
  isAgentPanel,
}: {
  claimRequestId: string | null | undefined
  isAgentPanel: boolean
}) {
  const { t } = useTranslation()

  if (!claimRequestId) {
    return (
      <Button
        presentation='reference'
        disabled
        size='sm'
        type='button'
        variant='secondary'
      >
        <IconExternalLink aria-hidden='true' className='size-4' />
        {t('claimRequests.duplicateDetails.actions.viewDuplicated')}
      </Button>
    )
  }

  return (
    <Button presentation='reference' asChild size='sm'>
      <a
        href={getTargetClaimRequestHref(claimRequestId, isAgentPanel)}
        rel='noreferrer'
        target='_blank'
      >
        <IconExternalLink aria-hidden='true' className='size-4' />
        {t('claimRequests.duplicateDetails.actions.viewDuplicated')}
      </a>
    </Button>
  )
}

export function ClaimRequestDuplicateImageDialog(
  props: ClaimRequestDuplicateImageDialogProps
) {
  const { duplicate, sourceAttachments, onOpenChange } = props
  const { t } = useTranslation()
  const isAgentPanel = useIsAgentPanel()
  const targetClaimRequestId = duplicate?.claimRequestId
  const targetQuery = useClaimRequestDuplicateTarget({
    claimRequestId: targetClaimRequestId,
    enabled: duplicate !== null,
    isAgentPanel,
  })
  const sourceImages = getImageAttachments(sourceAttachments)
  const targetImages = getImageAttachments(targetQuery.data?.attachments ?? [])
  const duplicateTotalCount = duplicate?.duplicateTotalCount

  return (
    <Dialog open={duplicate !== null} onOpenChange={onOpenChange}>
      <DialogContent
        presentation='reference'
        className='flex h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden p-4 sm:max-w-7xl sm:p-6'
      >
        <DialogHeader className='shrink-0 gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <DialogTitle>
            {t('claimRequests.duplicateDetails.imageDialogTitle')}
          </DialogTitle>
          <div className='me-5'>
            <ClaimRequestDuplicateTargetLink
              claimRequestId={targetClaimRequestId}
              isAgentPanel={isAgentPanel}
            />
          </div>
        </DialogHeader>

        <div className='grid min-h-0 flex-1 gap-4 lg:grid-cols-2'>
          <ClaimRequestDuplicateImageViewer
            attachments={sourceImages}
            title={t('claimRequests.duplicateDetails.sourceImage')}
          />
          {targetQuery.isLoading ? (
            <section className='rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground'>
              {t('common.loading')}
            </section>
          ) : targetQuery.isError ? (
            <section className='rounded-lg border bg-muted/20 p-3 text-sm text-destructive'>
              {t('common.errorStatus.generic')}
            </section>
          ) : (
            <ClaimRequestDuplicateImageViewer
              attachments={targetImages}
              title={t('claimRequests.duplicateDetails.targetImage')}
            />
          )}
        </div>

        {typeof duplicateTotalCount === 'number' ? (
          <p className='shrink-0 border-t pt-3 text-sm text-destructive'>
            {t('claimRequests.duplicateDetails.imageComparisonSummary', {
              sourceTotalCount: duplicate?.sourceTotalCount ?? 0,
              targetTotalCount: duplicate?.targetTotalCount ?? 0,
              duplicateTotalCount,
            })}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
