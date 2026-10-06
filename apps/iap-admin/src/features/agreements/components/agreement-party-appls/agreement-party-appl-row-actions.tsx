import { useCallback } from 'react'

import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import type { AgreementPartyApplFull } from '@iap/api-types'
import { AuditInformationRowAction } from '@shared/dialogs/audit-information'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconTrash } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'

export function AgreementPartyApplRowActions(props: {
  row: Row<AgreementPartyApplFull>
}) {
  const { row } = props
  const { t } = useTranslate()
  const setCurrentRow = useAgreementPartyApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )
  const openDelete = useCallback(() => {
    setCurrentRow(row.original)
    setOpenDialog('delete')
  }, [row.original, setCurrentRow, setOpenDialog])

  return (
    <TableActions>
      <TableActionButton
        presentation='reference'
        icon={<IconTrash aria-hidden='true' className='size-4' />}
        label={t('common.delete')}
        onClick={openDelete}
        tooltipText={t('common.delete')}
        variant='destructive'
      />
      <AuditInformationRowAction row={row.original} />
    </TableActions>
  )
}
