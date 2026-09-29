import { useDocTypeStore } from '@features/doc-types/model/doc-type-store'
import { ConfirmDialog } from '@iap/dialogs'
import { docTypeService } from '@modules/doc-types'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type DocTypeBulkDeleteDialogProps = {
  docTypeIds: string[]
  onSuccess: () => void
}

export function DocTypeBulkDeleteDialog(props: DocTypeBulkDeleteDialogProps) {
  const { docTypeIds, onSuccess } = props
  const { t } = useTranslation()
  const openDialog = useDocTypeStore((state) => state.openDialog)
  const setOpenDialog = useDocTypeStore((state) => state.setOpenDialog)
  const setRowSelection = useDocTypeStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: () => docTypeService.bulkDelete(docTypeIds),
    onSuccess: () => {
      toast.success(t('docTypes.bulkDelete.success'))
      setOpenDialog(null)
      setRowSelection({})
      onSuccess()
    },
  })
  const confirm = () => {
    if (!docTypeIds.length) {
      toast.error(t('docTypes.bulkDelete.noSelection'))
      return
    }
    mutation.mutate()
  }

  return (
    <ConfirmDialog
      confirmLabel={
        mutation.isPending
          ? t('docTypes.bulkDelete.submitting')
          : t('docTypes.bulkDelete.confirm')
      }
      description={
        <div className='space-y-2'>
          <p>
            {t('docTypes.bulkDelete.description', { count: docTypeIds.length })}
          </p>
          <p className='text-sm text-muted-foreground'>
            {t('docTypes.bulkDelete.selectionInfo', {
              count: docTypeIds.length,
            })}
          </p>
        </div>
      }
      disableConfirm={!docTypeIds.length}
      isLoading={mutation.isPending}
      onConfirm={confirm}
      onOpenChange={(open) => !open && setOpenDialog(null)}
      open={openDialog === 'bulkDelete'}
      title={t('docTypes.bulkDelete.title')}
      variant='error'
    />
  )
}
