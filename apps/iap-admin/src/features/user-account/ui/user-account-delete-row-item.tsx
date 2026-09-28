import { ConfirmDialog } from '@iap/dialogs'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useUserAccountStore } from '../model/user-account-store'
import { userAccountService } from '../services/user-account-service'

export function UserAccountDeleteRowItem(props: { onSuccess: () => void }) {
  const { onSuccess } = props
  const { t } = useTranslation()
  const { closeDialog, currentUser, dialog } = useUserAccountStore()
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
