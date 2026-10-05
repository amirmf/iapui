import { useCallback } from 'react'

import { UpdateUserAccountForm } from '@features/user-account/components/update-user-account-form'
import { useUserAccountStore } from '@features/user-account/context/store/user-account-store'
import { userAccountService } from '@features/user-account/services/user-account-service'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

export function PartyUserAccountDialog(props: { onSuccess: () => void }) {
  const { onSuccess } = props
  const { t } = useTranslate()
  const closeDialog = useUserAccountStore((state) => state.closeDialog)
  const currentUser = useUserAccountStore((state) => state.currentUser)
  const dialog = useUserAccountStore((state) => state.dialog)
  const isOpen = dialog === 'userAccount'
  const userAccountId = currentUser?.id
  const userAccountQuery = useQuery({
    enabled: isOpen && Boolean(userAccountId),
    queryFn: ({ signal }) => userAccountService.getById(userAccountId!, signal),
    queryKey: ['party-user-account', userAccountId],
  })
  const handleSuccess = useCallback(() => {
    onSuccess()
    closeDialog()
  }, [closeDialog, onSuccess])

  let content = (
    <p className='py-6 text-center text-sm text-muted-foreground'>
      {t('parties.userAccount.messages.missingUserAccount')}
    </p>
  )
  if (
    userAccountId &&
    (userAccountQuery.isLoading || userAccountQuery.isFetching)
  ) {
    content = (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        {t('common.loading')}
      </p>
    )
  } else if (userAccountId && userAccountQuery.isError) {
    content = (
      <div className='space-y-3 py-6 text-center'>
        <p className='text-sm text-muted-foreground'>
          {t('parties.userAccount.messages.loadError')}
        </p>
        <Button onClick={() => userAccountQuery.refetch()} variant='outline'>
          {t('parties.userAccount.buttons.retry')}
        </Button>
      </div>
    )
  } else if (userAccountQuery.data && currentUser && isOpen) {
    content = (
      <UpdateUserAccountForm
        onSuccess={handleSuccess}
        userAccount={userAccountQuery.data}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t('parties.userAccount.manageTitle', {
              name: currentUser?.displayName ?? currentUser?.username ?? '',
            })}
          </DialogTitle>
          <DialogDescription>
            {t('parties.userAccount.manageDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className='rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground'>
          {t('parties.userAccount.partySummary', {
            identifier: currentUser?.username ?? '—',
            name: currentUser?.displayName ?? '—',
          })}
        </div>
        {content}
      </DialogContent>
    </Dialog>
  )
}
