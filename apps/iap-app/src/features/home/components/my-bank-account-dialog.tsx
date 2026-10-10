import { useAuthSession } from '@iap/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

import { MyBankAccountForm } from './my-bank-account-form'

interface MyBankAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MyBankAccountDialog({
  open,
  onOpenChange,
}: MyBankAccountDialogProps) {
  const { t } = useTranslation()
  const { user } = useAuthSession()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('myiap.myBankAccount.dialog.title')}</DialogTitle>
          <DialogDescription>
            <span>{t('myiap.myBankAccount.dialog.accountName1')}</span>
            <span className='font-medium text-text-primary'>
              {' '}
              {user?.displayName}{' '}
            </span>
            <span>{t('myiap.myBankAccount.dialog.accountName2')}</span>
          </DialogDescription>
        </DialogHeader>
        <MyBankAccountForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default MyBankAccountDialog
