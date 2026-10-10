import { MyBankAccountForm } from '@features/my-claims/pages/create/components/my-bank-account-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function MyBankAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
  const translate = t as (key: string, options?: unknown) => string
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {translate('myiap.myBankAccount.dialog.title')}
          </DialogTitle>
          <DialogDescription>
            {translate('myiap.myBankAccount.dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <MyBankAccountForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
