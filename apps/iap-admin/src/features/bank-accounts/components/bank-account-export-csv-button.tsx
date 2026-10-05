import { useCallback } from 'react'

import type { BankAccount } from '@iap/api-types'
import { Button } from '@iap/ui'
import { useExportCsv } from '@shared/tables'
import { IconDownload } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function BankAccountExportCsvButton(props: {
  bankAccounts: BankAccount[]
}) {
  const { bankAccounts } = props
  const { t } = useTranslation()
  const createCsvRows = useCallback(
    (accounts: BankAccount[]) => [
      [
        t('bankAccounts.columns.bankAccountNumber'),
        t('bankAccounts.columns.bankAccountType'),
        t('bankAccounts.columns.phoneNumber'),
        t('bankAccounts.columns.userId'),
        t('bankAccounts.columns.isValid'),
        t('bankAccounts.columns.createdAt'),
      ],
      ...accounts.map((bankAccount) => [
        bankAccount.bankAccountNumber,
        t(`bankAccounts.types.${bankAccount.bankAccountType}`),
        bankAccount.phoneNumber ?? '',
        bankAccount.userId,
        t(bankAccount.isValid === 'Y' ? 'common.yes' : 'common.no'),
        bankAccount.createdAt ?? '',
      ]),
    ],
    [t]
  )
  const { exportCsv, isExporting } = useExportCsv({
    exportFileName: 'bank-accounts.csv',
    exportKey: 'bank-accounts-csv',
  })
  const handleExport = useCallback(() => {
    void exportCsv(createCsvRows(bankAccounts))
  }, [bankAccounts, createCsvRows, exportCsv])

  return (
    <Button disabled={isExporting} onClick={handleExport} variant='outline'>
      <IconDownload className='me-2 size-4' />
      {t('common.exportCsv')}
    </Button>
  )
}
