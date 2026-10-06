import { useMedicalCenterInvoiceDialog } from '@features/medical-center/context/store/medical-center-invoice-dialog-store'
import { useDeleteMedicalCenterInvoice } from '@features/medical-center/queries/medical-center-invoice-query'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function MedicalCenterInvoiceDeleteDialog() {
  const { t: rawT } = useTranslation()
  const t = rawT as (key: string, options?: Record<string, unknown>) => string
  const activeDialog = useMedicalCenterInvoiceDialog(
    (state) => state.activeDialog
  )
  const selectedInvoice = useMedicalCenterInvoiceDialog(
    (state) => state.selectedInvoice
  )
  const closeDialog = useMedicalCenterInvoiceDialog(
    (state) => state.closeDialog
  )
  const mutation = useDeleteMedicalCenterInvoice()

  const handleDelete = () => {
    const id = selectedInvoice?.id
    if (!id || mutation.isPending) return

    mutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('medicalCenter.messages.deleted'))
        closeDialog()
      },
      onError: () => toast.error(t('medicalCenter.messages.deleteError')),
    })
  }

  return (
    <ConfirmDialog
      presentation='reference'
      open={activeDialog === 'delete'}
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) closeDialog()
      }}
      title={t('medicalCenter.delete.title')}
      description={t('medicalCenter.delete.description', {
        documentNumber: selectedInvoice?.documentNumber ?? '-',
      })}
      confirmLabel={t('medicalCenter.actions.delete')}
      confirmVariant='destructive'
      isLoading={mutation.isPending}
      onConfirm={handleDelete}
    />
  )
}
