import { useBankAccountStore } from '@features/bank-accounts/model/bank-account-store'
import { bankAccountService } from '@features/bank-accounts/services/bank-account-service'
import { ConfirmDialog } from '@iap/dialogs'
import { IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function BankAccountBulkDeleteDialog(props: {
  bankAccountIds: string[]
  refetch?: () => void
}) {
  const { bankAccountIds, refetch } = props
  const { t } = useTranslation()
  const openDialog = useBankAccountStore((state) => state.openDialog)
  const setOpenDialog = useBankAccountStore((state) => state.setOpenDialog)
  const setRowSelection = useBankAccountStore((state) => state.setRowSelection)
  const mutation = useMutation({
    mutationFn: () => bankAccountService.bulkDelete(bankAccountIds),
    onSuccess: () => {
      toast.success(t('bankAccounts.bulkDelete.success'))
      refetch?.()
      setOpenDialog(null)
      setRowSelection({})
    },
  })
  const handleConfirm = () => {
    if (bankAccountIds.length === 0) {
      toast.error(t('bankAccounts.bulkDelete.noSelection'))
      return
    }
    mutation.mutate()
  }

  return (
    <ConfirmDialog
      confirmLabel={
        mutation.isPending
          ? t('bankAccounts.bulkDelete.submitting')
          : t('bankAccounts.bulkDelete.confirm')
      }
      confirmVariant='destructive'
      description={t('bankAccounts.bulkDelete.description', {
        count: bankAccountIds.length,
      })}
      disableConfirm={bankAccountIds.length === 0}
      isLoading={mutation.isPending}
      onConfirm={handleConfirm}
      onOpenChange={(open) => setOpenDialog(open ? 'bulkDelete' : null)}
      open={openDialog === 'bulkDelete'}
      title={
        <span className='flex items-center gap-2 text-destructive'>
          <IconTrash size={18} />
          {t('bankAccounts.bulkDelete.title')}
        </span>
      }
    />
  )
}
