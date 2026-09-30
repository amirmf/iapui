import { useBankAccountStore } from '@features/bank-accounts/model/bank-account-store'
import type { BankAccount } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconTrash } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function BankAccountRowActions(props: { row: Row<BankAccount> }) {
  const { row } = props
  const { t } = useTranslation()
  const setCurrentRow = useBankAccountStore((state) => state.setCurrentRow)
  const setOpenDialog = useBankAccountStore((state) => state.setOpenDialog)
  const handleDelete = () => {
    setCurrentRow(row.original)
    setOpenDialog('delete')
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<IconTrash className='size-5' />}
        label={t('bankAccounts.actions.delete')}
        onClick={handleDelete}
        tooltipText={t('bankAccounts.actions.delete')}
        variant='destructive'
      />
    </TableActions>
  )
}
