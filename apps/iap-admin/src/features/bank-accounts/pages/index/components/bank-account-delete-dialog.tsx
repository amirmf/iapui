import { useBankAccountStore } from '@features/bank-accounts/context/store/bank-account-store'
import { bankAccountService } from '@features/bank-accounts/services/bank-account-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function BankAccountDeleteDialog(props: { refetch?: () => void }) {
  const { refetch } = props
  const { t } = useTranslation()
  const currentRow = useBankAccountStore((state) => state.currentRow)
  const openDialog = useBankAccountStore((state) => state.openDialog)
  const setCurrentRow = useBankAccountStore((state) => state.setCurrentRow)
  const setOpenDialog = useBankAccountStore((state) => state.setOpenDialog)
  const close = () => {
    setOpenDialog(null)
    setTimeout(() => setCurrentRow(null), 500)
  }
  const mutation = useMutation({
    mutationFn: bankAccountService.delete,
    onSuccess: () => {
      toast.success(t('bankAccounts.messages.deleted'))
      refetch?.()
      close()
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      description={t('common.dialog.deleteDialog.confirmMessage')}
      isLoading={mutation.isPending}
      onConfirm={() => currentRow?.id && mutation.mutate(currentRow.id)}
      onOpenChange={close}
      open={openDialog === 'delete'}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('common.dialog.deleteDialog.permanentTitle')}
        </span>
      }
    />
  )
}
