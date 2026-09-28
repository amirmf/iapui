import { useUserAccountStore } from '@features/user-account/model/user-account-store'
import { userAccountService } from '@features/user-account/services/user-account-service'
import { ConfirmDialog } from '@iap/dialogs'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function UserAccountDeleteRowItem(props: { onSuccess: () => void }) {
  const { onSuccess } = props
  const { t } = useTranslate()
  const closeDialog = useUserAccountStore((state) => state.closeDialog)
  const currentUser = useUserAccountStore((state) => state.currentUser)
  const dialog = useUserAccountStore((state) => state.dialog)
  const mutation = useMutation({
    mutationFn: () =>
      currentUser?.id
        ? userAccountService.delete(currentUser.id)
        : Promise.resolve(undefined),
    onSuccess: () => {
      toast.success(t('parties.messages.permanentDeleted'))
      closeDialog()
      onSuccess()
    },
  })

  return (
    <ConfirmDialog
      confirmLabel={t('parties.userAccount.delete.confirm')}
      description={t('parties.userAccount.delete.description')}
      isLoading={mutation.isPending}
      onConfirm={() => mutation.mutate()}
      onOpenChange={(open) => {
        if (mutation.isPending) return
        if (!open) closeDialog()
      }}
      open={dialog === 'delete'}
      title={t('parties.userAccount.delete.title')}
      variant='error'
    />
  )
}
