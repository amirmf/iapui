import { useDamageCodeStore } from '@features/damage-codes/model/damage-code-store'
import type { DamageCode } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { BadgeDollarSign, Eye, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DamageCodeRowActions(props: { row: Row<DamageCode> }) {
  const { row } = props
  const { t } = useTranslation()
  const setCurrentRow = useDamageCodeStore((state) => state.setCurrentRow)
  const setOpenDialog = useDamageCodeStore((state) => state.setOpenDialog)
  const open = (dialog: 'edit' | 'pricing' | 'view') => {
    setCurrentRow(row.original)
    setOpenDialog(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<Eye aria-hidden='true' className='size-4' />}
        label={t('damageCodes.actions.viewDetails')}
        onClick={() => open('view')}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('damageCodes.actions.edit')}
        onClick={() => open('edit')}
      />
      <TableActionButton
        icon={<BadgeDollarSign aria-hidden='true' className='size-4' />}
        label={t('damageCodes.actions.managePricing')}
        onClick={() => open('pricing')}
      />
    </TableActions>
  )
}
