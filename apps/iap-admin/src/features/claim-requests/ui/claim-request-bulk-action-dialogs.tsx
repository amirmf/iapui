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

import { useClaimRequestStore } from '../model/claim-request-store'
import { claimRequestService } from '../services/claim-request-service'

type BulkAction = 'bulkDelete' | 'bulkGenerateAndSend' | 'bulkInquiryFanavaran'

const actionDetails: Record<
  BulkAction,
  { descriptionKey: string; titleKey: string }
> = {
  bulkDelete: {
    descriptionKey: 'claimRequests.bulk.delete.description',
    titleKey: 'claimRequests.bulk.delete.title',
  },
  bulkGenerateAndSend: {
    descriptionKey: 'claimRequests.bulk.generateAndSend.description',
    titleKey: 'claimRequests.bulk.generateAndSend.title',
  },
  bulkInquiryFanavaran: {
    descriptionKey: 'claimRequests.bulk.inquiry.description',
    titleKey: 'claimRequests.bulk.inquiry.title',
  },
}

export function ClaimRequestBulkActionDialogs(props: {
  claimRequestIds: string[]
  onSuccess: () => void
}) {
  const { claimRequestIds, onSuccess } = props
  const { t } = useTranslation()
  const openDialog = useClaimRequestStore((state) => state.openDialog)
  const setOpenDialog = useClaimRequestStore((state) => state.setOpenDialog)
  const setRowSelection = useClaimRequestStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: (action: BulkAction) => {
      if (action === 'bulkDelete')
        return claimRequestService.bulkDelete(claimRequestIds)
      if (action === 'bulkGenerateAndSend')
        return claimRequestService.generateAndSendBulk(claimRequestIds)
      return claimRequestService.inquiryFanavaranBulk(claimRequestIds)
    },
    onSuccess: () => {
      setOpenDialog(null)
      setRowSelection({})
      onSuccess()
    },
  })

  if (!openDialog || !(openDialog in actionDetails)) return null

  const action = openDialog as BulkAction
  const details = actionDetails[action]
  return (
    <AlertDialog
      onOpenChange={(open) => !open && setOpenDialog(null)}
      open={Boolean(openDialog)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(details.titleKey as never)}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(details.descriptionKey as never, {
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
              mutation.mutate(action)
            }}
          >
            {mutation.isPending ? t('common.loading') : t('common.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
