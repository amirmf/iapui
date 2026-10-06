import { AssignementRuleRowActions } from '@features/assignement-rules/components/assignement-rule-row-actions'
import {
  assignementRuleStatusBadgeColors,
  assignementRuleStatusTranslationKeys,
} from '@features/assignement-rules/constants/assignement-rule-constant'
import type { AssignementRule } from '@iap/api-types'
import { Badge } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function useAssignementRuleColumns(): ColumnDef<AssignementRule>[] {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className='min-w-40 font-medium'>{row.original.title ?? '-'}</div>
      ),
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assignementRules.columns.title')}
        />
      ),
    },
    {
      accessorKey: 'docTypeCode',
      cell: ({ row }) => row.original.docTypeCode ?? '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assignementRules.columns.docTypeCode')}
        />
      ),
    },
    {
      accessorKey: 'mainAssignedUserUsername',
      cell: ({ row }) => row.original.mainAssignedUserUsername ?? '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assignementRules.columns.assignee')}
        />
      ),
    },
    {
      accessorKey: 'extWorkUnitCode',
      cell: ({ row }) => row.original.extWorkUnitCode ?? '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assignementRules.columns.workUnit')}
        />
      ),
    },
    {
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status ?? 'INACTIVE'
        return (
          <Badge
            className={assignementRuleStatusBadgeColors[status]}
            variant='outline'
          >
            {t(assignementRuleStatusTranslationKeys[status])}
          </Badge>
        )
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('assignementRules.columns.status')}
        />
      ),
    },
    {
      cell: ({ row }) => <AssignementRuleRowActions row={row} />,
      id: 'actions',
      meta: { className: 'sticky left-0 bg-background w-20' },
    },
  ]
}
