import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import type { Agreement } from '@iap/api-types'
import { AuditInformationRowAction } from '@shared/dialogs/audit-information'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconSparkles } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'

export function AgreementRowActions(props: { row: Row<Agreement> }) {
  const { row } = props
  const { t } = useTranslate()
  const setCurrentRow = useAgreementStore((state) => state.setCurrentRow)
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  const open = (dialog: 'edit' | 'initializeCoverageAppls') => {
    setCurrentRow(row.original)
    setOpenDialog(dialog)
  }

  return (
    <TableActions>
      <TableActionButton
        presentation='reference'
        icon={<IconEdit aria-hidden='true' className='size-4' />}
        label={t('agreements.actions.edit')}
        onClick={() => open('edit')}
        tooltipText={t('agreements.actions.edit')}
      />
      <TableActionButton
        presentation='reference'
        icon={<IconSparkles aria-hidden='true' className='size-4' />}
        label={t('agreements.actions.initializeCoverageAppls')}
        onClick={() => open('initializeCoverageAppls')}
        tooltipText={t('agreements.actions.initializeCoverageAppls')}
      />
      <AuditInformationRowAction row={row.original} />
    </TableActions>
  )
}
