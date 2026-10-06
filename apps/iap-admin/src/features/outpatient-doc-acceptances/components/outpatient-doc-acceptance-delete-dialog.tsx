import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function OutpatientDocAcceptanceDeleteDialog() {
  const { t: translate } = useTranslation()
  const t = translate as (
    key: string,
    options?: Record<string, unknown>
  ) => string
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'delete'
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: outpatientDocAcceptanceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.deleted'))
      closeDialog({ clearRow: true })
    },
  })

  const handleDelete = () => {
    if (currentRow?.id) {
      deleteMutation.mutate(currentRow.id)
    }
  }

  const isLoading = deleteMutation.isPending

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
      onConfirm={handleDelete}
      disableConfirm={isLoading}
      isLoading={isLoading}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('common.dialog.deleteDialog.permanentTitle')}
        </span>
      }
      description={
        <div className='space-y-4'>
          <p className='text-sm'>
            {t('common.dialog.deleteDialog.confirmMessage')}
          </p>
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
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
    />
  )
}
