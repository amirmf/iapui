import { useMemo } from 'react'

import { useClaimRequestStore } from '@features/claim-requests/context/store/claim-request-store'
import { coreAiService } from '@features/claim-requests/services/core-ai-service'
import { useAuthSession } from '@iap/auth'
import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function ClaimRequestBulkCoreAiDialog(props: {
  claimRequestIds: string[]
  onSuccess: () => Promise<unknown> | void
}) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const initiatedBy = useMemo(
    () => user?.id?.trim() || user?.username?.trim() || 'system',
    [user]
  )
  const mutation = useMutation({
    mutationFn: () =>
      coreAiService.bulkStartDataExtractionWorkflow(
        claimRequestIds.map((claimRequestId) => ({
          claimRequestId,
          initiatedBy,
          workflowId: claimRequestId,
        }))
      ),
    onSuccess: (responses) => {
      toast.success(
        t('claimRequests.bulkDataExtraction.success', {
          count: responses.length,
        })
      )
      onSuccess()
      setOpenDialog(null)
      setRowSelection({})
    },
    onError: () => toast.error(t('claimRequests.bulkDataExtraction.error')),
  })
  const isOpen = openDialog === 'bulkDataExtraction'

  return (
    <ConfirmDialog
      presentation='reference'
      onOpenChange={(open) => {
        if (!open) setOpenDialog(null)
      }}
      open={isOpen}
      title={t('claimRequests.bulkDataExtraction.title')}
      isLoading={mutation.isPending}
      disableConfirm={claimRequestIds.length === 0}
      onConfirm={() => {
        if (claimRequestIds.length === 0) {
          toast.error(t('claimRequests.bulkDataExtraction.noSelection'))
          return
        }
        mutation.mutate()
      }}
      confirmLabel={
        mutation.isPending
          ? t('claimRequests.bulkDataExtraction.submitting')
          : t('claimRequests.bulkDataExtraction.confirm')
      }
      description={
        <div className='space-y-2'>
          <p>
            {t('claimRequests.bulkDataExtraction.description', {
              count: claimRequestIds.length,
            })}
          </p>
          <p className='text-sm text-muted-foreground'>
            {t('claimRequests.bulkDataExtraction.selectionInfo', {
              count: claimRequestIds.length,
            })}
          </p>
        </div>
      }
    />
  )
}
