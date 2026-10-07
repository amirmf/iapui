import { useState } from 'react'

import {
  CLAIM_REQUEST_DUPLICATE_TYPE_BADGE_COLORS,
  CLAIM_REQUEST_DUPLICATE_TYPE_BOX_COLORS,
  CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS,
} from '@features/claim-requests/model/claim-request-status'
import { ClaimRequestDuplicateImageDialog } from '@features/claim-requests/pages/claim-request-management/components/duplicated/claim-request-duplicate-image-dialog'
import { useIsAgentPanel } from '@features/claim-requests/pages/claim-request-management/route-adapters/use-is-agent-panel'
import { type ClaimRequest } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Button } from '@iap/ui'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { IconExternalLink, IconPhoto } from '@tabler/icons-react'

type ClaimRequestDuplicate = NonNullable<ClaimRequest['duplicates']>[number]

const MAIN_NATIONAL_CODE_DUPLICATE_DESCRIPTION =
  'Main national code, submission date, and document type match another claim request'

interface ClaimRequestDuplicatedSectionProps {
  claimRequest: ClaimRequest
}

function getTargetClaimRequestHref(
  claimRequestId: string,
  isAgentPanel: boolean
) {
  const prefix = isAgentPanel ? '/agent' : ''
  return `${prefix}/claim-requests/${claimRequestId}/claim-request-management/`
}

export function ClaimRequestDuplicatedSection(
  props: ClaimRequestDuplicatedSectionProps
) {
  const { claimRequest } = props
  const { t } = useTranslation()
  const isAgentPanel = useIsAgentPanel()
  const [selectedImageDuplicate, setSelectedImageDuplicate] =
    useState<ClaimRequestDuplicate | null>(null)
  const duplicates = claimRequest.duplicates ?? []

  if (!duplicates.length) {
    return null
  }

  return (
    <>
      <section
        aria-label={t('claimRequests.duplicateDetails.title')}
        className='mt-4'
      >
        <ul className='space-y-2'>
          {duplicates.map((duplicate, index) => {
            const isImageDuplicate = duplicate.type === 'IMAGE'
            const targetClaimRequestId = duplicate.claimRequestId
            const duplicateType = duplicate.type
            const typeLabel = duplicateType
              ? t(
                  CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS[duplicateType],
                  {
                    defaultValue:
                      CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS[
                        duplicateType
                      ],
                  }
                )
              : t('common.noData')
            const typeColor = duplicateType
              ? CLAIM_REQUEST_DUPLICATE_TYPE_BADGE_COLORS[duplicateType]
              : undefined
            const boxColor = duplicateType
              ? CLAIM_REQUEST_DUPLICATE_TYPE_BOX_COLORS[duplicateType]
              : undefined
            const targetHref = targetClaimRequestId
              ? getTargetClaimRequestHref(targetClaimRequestId, isAgentPanel)
              : null
            const description =
              duplicate.description === MAIN_NATIONAL_CODE_DUPLICATE_DESCRIPTION
                ? t('claimRequests.duplicateDetails.matchingClaimRequest')
                : duplicate.description

            return (
              <li
                className={cn(
                  'flex flex-wrap items-end justify-between gap-3 rounded-md border px-3 py-2 text-sm',
                  boxColor ?? 'bg-muted/20'
                )}
                key={
                  duplicate.id ??
                  `${duplicate.businessKey ?? 'duplicate'}-${index}`
                }
              >
                <div className='min-w-0 flex-1 space-y-1'>
                  <Badge
                    presentation='reference'
                    className={cn('mb-1 w-fit', typeColor)}
                    variant='outline'
                  >
                    {typeLabel}
                  </Badge>
                  {isImageDuplicate ? (
                    <p className='break-words text-xs font-medium'>
                      {t('claimRequests.duplicateDetails.imageDescription')}
                    </p>
                  ) : description ? (
                    <p className='break-words text-xs font-medium'>
                      {description}
                    </p>
                  ) : null}
                </div>

                <div className='flex flex-wrap gap-2'>
                  <Button
                    presentation='reference'
                    type='button'
                    size='xs'
                    variant='secondary'
                    onClick={() => setSelectedImageDuplicate(duplicate)}
                  >
                    <IconPhoto aria-hidden='true' className='size-4' />
                    {t('claimRequests.duplicates.actions.picture')}
                  </Button>
                  {targetHref ? (
                    <Button
                      presentation='reference'
                      asChild
                      size='xs'
                      variant='default'
                    >
                      <a href={targetHref} rel='noreferrer' target='_blank'>
                        <IconExternalLink
                          aria-hidden='true'
                          className='size-4'
                        />
                        {t('claimRequests.duplicateDetails.actions.viewTarget')}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      presentation='reference'
                      disabled
                      size='xs'
                      type='button'
                      variant='secondary'
                    >
                      <IconExternalLink aria-hidden='true' className='size-4' />
                      {t('claimRequests.duplicateDetails.actions.viewTarget')}
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {/*<ClaimRequestDuplicateReviewConfirmation />*/}
      </section>
      <Separator className='my-4' />
      <ClaimRequestDuplicateImageDialog
        duplicate={selectedImageDuplicate}
        sourceAttachments={claimRequest.attachments ?? []}
        onOpenChange={(open) => !open && setSelectedImageDuplicate(null)}
      />
    </>
  )
}
