import { useEffect } from 'react'

import { useClaimRequestManagementPrevRequestAttachments } from '@features/claim-requests/context/store/claim-request-management-prev-request-attachments-store'
import {
  CLAIM_REQUEST_STATUS_TRANSLATION_KEYS,
  claimStatusColors,
} from '@features/claim-requests/model/claim-request-status'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import type { Attachment } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { FileViewer } from '@modules/files'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

interface ClaimRequestAttachmentsDialogProps {
  isOpen?: boolean
}

export function ClaimRequestAttachmentsDialog(
  props: ClaimRequestAttachmentsDialogProps
) {
  const { isOpen } = props
  const { closeDialog, selectedClaimRequestId } =
    useClaimRequestManagementPrevRequestAttachments()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const isAgentPanel = false

  const { data, error, isError, isLoading, isFetching, isFetched } = useQuery({
    queryFn: ({ signal }) =>
      claimRequestService.findById(selectedClaimRequestId!, signal),
    queryKey: ['claimRequest', selectedClaimRequestId, isAgentPanel],
    enabled: !!selectedClaimRequestId && isOpen,
    staleTime: 30_000,
    gcTime: 30_000,
  })

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({
        queryKey: ['claimRequest', selectedClaimRequestId],
      })
    }
  }, [queryClient, selectedClaimRequestId])

  const attachments = Array.isArray(data?.attachments)
    ? (data.attachments as Attachment[])
    : []
  const isDeletedClaimRequest = data?.status === 'DELETED'
  const statusColor = data?.status ? claimStatusColors[data?.status] : ''
  const statusTranslationKey = data?.status
    ? CLAIM_REQUEST_STATUS_TRANSLATION_KEYS[data?.status]
    : undefined

  const loading = isLoading || isFetching

  const errorStatus = isAxiosError(error) ? error.response?.status : undefined
  const isNotFoundError = errorStatus === 404
  const isServerError = errorStatus === 500

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent presentation='reference' className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='flex flex-wrap items-center gap-2'>
            <span>{t('claimRequests.duplicates.actions.picture')}</span>
            {isDeletedClaimRequest ? (
              <Badge
                presentation='reference'
                variant='outline'
                className={cn('w-fit rounded-full capitalize', statusColor)}
              >
                {statusTranslationKey ? t(statusTranslationKey) : '-'}
              </Badge>
            ) : null}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (!isFetched || loading) ? (
          <div className='text-center text-sm text-muted-foreground'>
            {t('common.loading')}
          </div>
        ) : isError && isNotFoundError ? (
          <div className='text-center text-destructive'>
            {t('common.errorStatus.notFound')}
          </div>
        ) : isError && isServerError ? (
          <div className='text-center text-destructive'>
            {t('common.errorStatus.serverError')}
          </div>
        ) : isError ? (
          <div className='text-center text-destructive'>
            {t('common.errorStatus.generic')}
          </div>
        ) : attachments.length ? (
          <FileViewer
            attachments={attachments}
            transformComponentWrapperStyle={{
              height: '70vh',
              maxWidth: '100%',
            }}
          />
        ) : (
          <div className='text-sm text-muted-foreground'>
            {t('common.noData')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
