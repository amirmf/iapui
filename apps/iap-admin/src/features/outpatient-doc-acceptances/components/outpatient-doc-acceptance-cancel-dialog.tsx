import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconBan } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function OutpatientDocAcceptanceCancelDialog() {
  const { t: translate } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'cancel'
  const queryClient = useQueryClient()

  const cancelMutation = useMutation({
    mutationFn: outpatientDocAcceptanceService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.cancelled'))
      closeDialog({ clearRow: true })
    },
  })

  const handleCancel = () => {
    if (currentRow?.id) {
      cancelMutation.mutate(currentRow.id)
    }
  }

  const isLoading = cancelMutation.isPending

  const handleClose = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      closeDialog({ clearRow: true })
    }
  }

  if (!currentRow) {
    return null
  }

  return (
    <ConfirmDialog
      presentation='reference'
      open={isModalOpen}
      onOpenChange={handleClose}
      onConfirm={handleCancel}
      disableConfirm={isLoading}
      isLoading={isLoading}
      title={
        <span className='flex items-center gap-2'>
          <IconBan size={18} />
          {t('outpatientDocAcceptances.dialog.cancelTitle')}
        </span>
      }
      description={
        <div className='space-y-2 text-sm'>
          <p>{t('outpatientDocAcceptances.dialog.cancelConfirmation')}</p>
          <div className='space-y-1 text-xs text-muted-foreground'>
            {currentRow.letterNo ? (
              <p>
                <span className='font-medium'>
                  {t('outpatientDocAcceptances.columns.letterNo')}:
                </span>{' '}
                {currentRow.letterNo}
              </p>
            ) : null}
            {currentRow.exId ? (
              <p>
                <span className='font-medium'>
                  {t('outpatientDocAcceptances.columns.exId')}:
                </span>{' '}
                {currentRow.exId}
              </p>
            ) : null}
            {currentRow.id ? (
              <p>
                <span className='font-medium'>ID:</span> {currentRow.id}
              </p>
            ) : null}
          </div>
        </div>
      }
      confirmLabel={t('outpatientDocAcceptances.dialog.confirmCancel')}
    />
  )
}
