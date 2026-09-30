import { useBankAccountStore } from '@features/bank-accounts/model/bank-account-store'
import { BankAccountExportCsvButton } from '@features/bank-accounts/pages/index/components/bank-account-export-csv-button'
import type { BankAccount } from '@iap/api-types'
import { Button } from '@iap/ui'
import { IconRefresh, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function BankAccountHeaderActions(props: {
  bankAccountIds: string[]
  bankAccounts: BankAccount[]
  isLoading?: boolean
  onRefetch?: () => void
}) {
  const { bankAccountIds, bankAccounts, isLoading, onRefetch } = props
  const { t } = useTranslation()
  const setOpenDialog = useBankAccountStore((state) => state.setOpenDialog)

  return (
    <div className='flex items-center gap-2'>
      <Button
        disabled={bankAccountIds.length === 0}
        onClick={() => setOpenDialog('bulkDelete')}
        variant='destructive'
      >
        <IconTrash className='me-2 size-4' />
        {t('bankAccounts.actions.bulkDelete')}
      </Button>
      <BankAccountExportCsvButton bankAccounts={bankAccounts} />
      <Button disabled={isLoading} onClick={onRefetch} variant='outline'>
        <IconRefresh className='me-2 size-4' />
        {t('common.refresh')}
      </Button>
    </div>
  )
}
