import { usePersonSpecialDiseaseStore } from '@features/person-special-diseases/model/store/person-special-disease-store'
import { ConfirmDialog } from '@iap/dialogs'
import { personSpecialDiseaseService } from '@modules/person-special-diseases'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type PersonSpecialDiseaseDeleteDialogProps = {
  refetch?: () => Promise<unknown> | void
}

export function PersonSpecialDiseaseDeleteDialog(
  props: PersonSpecialDiseaseDeleteDialogProps
) {
  const { refetch } = props
  const { t } = useTranslation()
  const currentRow = usePersonSpecialDiseaseStore((state) => state.currentRow)
  const openDialog = usePersonSpecialDiseaseStore((state) => state.openDialog)
  const setCurrentRow = usePersonSpecialDiseaseStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = usePersonSpecialDiseaseStore(
    (state) => state.setOpenDialog
  )
  const close = () => {
    setOpenDialog(null)
    setTimeout(() => setCurrentRow(null), 300)
  }
  const mutation = useMutation({
    mutationFn: personSpecialDiseaseService.delete,
    onSuccess: async () => {
      await refetch?.()
      close()
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('personSpecialDiseases.actions.delete')}
      description={t('personSpecialDiseases.deleteDialog.description')}
      isLoading={mutation.isPending}
      onConfirm={() => {
        if (currentRow?.id) mutation.mutate(currentRow.id)
      }}
      onOpenChange={(open) => !open && close()}
      open={openDialog === 'delete'}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <Trash2 aria-hidden='true' className='size-4' />
          {t('personSpecialDiseases.deleteDialog.title')}
        </span>
      }
      variant='error'
    />
  )
}
