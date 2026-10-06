import { useCallback } from 'react'

import { useAgreementCoverageApplStore } from '@features/agreements/context/store/agreement-coverage-appl-store'
import type { AgreementCoverageApplFull } from '@iap/api-types'
import { AuditInformationRowAction } from '@shared/dialogs/audit-information'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { IconEdit, IconEye } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'

export function AgreementCoverageApplRowActions(props: {
  row: Row<AgreementCoverageApplFull>
}) {
  const { row } = props
  const { t } = useTranslate()
  const setCurrentRow = useAgreementCoverageApplStore(
    (state) => state.setCurrentRow
  )
  const setInlineEditRow = useAgreementCoverageApplStore(
    (state) => state.setInlineEditRow
  )
  const setOpen = useAgreementCoverageApplStore((state) => state.setOpen)
  const open = useCallback(
    (dialog: 'edit' | 'view') => {
      setCurrentRow(row.original)
      setOpen(dialog)
    },
    [row.original, setCurrentRow, setOpen]
  )
  const inlineEdit = useCallback(() => {
    if (!row.original.id) return
    setCurrentRow(null)
    setOpen(null)
    setInlineEditRow(row.original)
  }, [row.original, setCurrentRow, setInlineEditRow, setOpen])

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEye aria-hidden='true' className='size-4' />}
        label={t('agreementCoverageAppls.actions.view' as never)}
        onClick={() => open('view')}
        tooltipText={t('agreementCoverageAppls.actions.view' as never)}
      />
      <TableActionButton
        icon={<IconEdit aria-hidden='true' className='size-4' />}
        label={t('agreementCoverageAppls.actions.edit' as never)}
        onClick={() => open('edit')}
        tooltipText={t('agreementCoverageAppls.actions.edit' as never)}
      />
      <TableActionButton
        icon={<IconEdit aria-hidden='true' className='size-4' />}
        label={t('agreementCoverageAppls.actions.inlineEdit' as never)}
        onClick={inlineEdit}
        tooltipText={t('agreementCoverageAppls.actions.inlineEdit' as never)}
      />
      <AuditInformationRowAction row={row.original} />
    </TableActions>
  )
}
