import { useDocTypeStore } from '@features/doc-types/model/doc-type-store'
import { ConfirmDialog } from '@iap/dialogs'
import { docTypeService } from '@modules/doc-types'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type DocTypeDeleteDialogProps = { onSuccess: () => void }

export function DocTypeDeleteDialog(props: DocTypeDeleteDialogProps) {
  const { onSuccess } = props
  const { t } = useTranslation()
  const currentRow = useDocTypeStore((state) => state.currentRow)
  const openDialog = useDocTypeStore((state) => state.openDialog)
  const setCurrentRow = useDocTypeStore((state) => state.setCurrentRow)
  const setOpenDialog = useDocTypeStore((state) => state.setOpenDialog)
  const close = () => {
    setOpenDialog(null)
    setTimeout(() => setCurrentRow(null), 500)
  }
  const mutation = useMutation({
    mutationFn: docTypeService.delete,
    onSuccess: () => {
      toast.success(t('docTypes.messages.deleted'))
      close()
      onSuccess()
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      description={
        <div className='space-y-4'>
          <p>{t('common.dialog.deleteDialog.confirmMessage')}</p>
          <p className='text-sm text-muted-foreground'>
            <span className='font-medium'>
              {t('docTypes.columns.docType')}:
            </span>{' '}
            {currentRow?.docType}
          </p>
        </div>
      }
      isLoading={mutation.isPending}
      onConfirm={() => currentRow?.id && mutation.mutate(currentRow.id)}
      onOpenChange={(open) => !open && close()}
      open={openDialog === 'delete'}
      title={t('common.dialog.deleteDialog.permanentTitle')}
      variant='error'
    />
  )
}
