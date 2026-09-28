import { TableActionButton } from '@shared/tables'
import { UserSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { type AuditInfo, useAuditInfoStore } from './audit-info-store'

type AuditInformationRowActionProps = { row: AuditInfo }

function hasValue(value?: string | null) {
  return typeof value === 'string' && value.trim().length > 0
}

export function AuditInformationRowAction(
  props: AuditInformationRowActionProps
) {
  const { row } = props
  const { t } = useTranslation()

  if (!hasValue(row.createdBy) && !hasValue(row.updatedBy)) return null

  return (
    <TableActionButton
      icon={<UserSquare aria-hidden='true' className='size-4' />}
      label={t('common.auditInfo.action')}
      onClick={() => useAuditInfoStore.getState().open(row)}
      tooltipText={t('common.auditInfo.action')}
      variant='secondary'
    />
  )
}
