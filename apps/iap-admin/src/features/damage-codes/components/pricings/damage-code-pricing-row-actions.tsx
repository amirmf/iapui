import { useDamageCodeStore } from '@features/damage-codes/model/store/damage-code-store'
import type { DamageCodePricing } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import type { Row } from '@tanstack/react-table'
import { Eye, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DamageCodePricingRowActions(props: {
  row: Row<DamageCodePricing>
}) {
  const { row } = props
  const { t } = useTranslation()
  const setCurrentPricing = useDamageCodeStore(
    (state) => state.setCurrentPricing
  )
  const setOpenPricingDialog = useDamageCodeStore(
    (state) => state.setOpenPricingDialog
  )
  const open = (dialog: 'edit' | 'view') => {
    setCurrentPricing(row.original)
    setOpenPricingDialog(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<Eye aria-hidden='true' className='size-4' />}
        label={t('damageCodePricings.actions.viewDetails')}
        onClick={() => open('view')}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('damageCodePricings.actions.edit')}
        onClick={() => open('edit')}
      />
    </TableActions>
  )
}
