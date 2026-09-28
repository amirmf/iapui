import { useMemo } from 'react'

import { useAuthSession } from '@iap/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useClaimRequestStore } from '../model/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

export function ClaimRequestBulkCoreAiDialog(props: {
  claimRequestIds: string[]
  onSuccess: () => void
}) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const initiatedBy = useMemo(
    () => user?.id.trim() || user?.username.trim() || 'system',
    [user]
  )
  const mutation = useMutation({
    mutationFn: () =>
      claimRequestService.startBulkCoreAiDataExtraction(
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
      setOpenDialog(null)
      setRowSelection({})
      onSuccess()
    },
    onError: () => toast.error(t('claimRequests.bulkDataExtraction.error')),
  })
  const isOpen = openDialog === 'bulkDataExtraction'

  return (
    <AlertDialog
      onOpenChange={(open) => !open && setOpenDialog(null)}
      open={isOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('claimRequests.bulkDataExtraction.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('claimRequests.bulkDataExtraction.description', {
              count: claimRequestIds.length,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={claimRequestIds.length === 0 || mutation.isPending}
            onClick={(event) => {
              event.preventDefault()
              if (claimRequestIds.length === 0) {
                toast.error(t('claimRequests.bulkDataExtraction.noSelection'))
                return
              }
              mutation.mutate()
            }}
          >
            {mutation.isPending
              ? t('claimRequests.bulkDataExtraction.submitting')
              : t('claimRequests.bulkDataExtraction.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
