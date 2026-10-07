import {
  PARTY_ROLE_TRANSLATION_KEYS,
  partyRoleColors,
} from '@features/user-account'
import type { PartyRole, SubUser } from '@iap/api-types'
import { Badge, cn } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { subUserStatusColors } from '../constants/sub-user-constant'
import { SubUserRowActions } from './sub-user-row-actions'

export const useSubUserColumns = (): ColumnDef<SubUser>[] => {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subUsers.columns.username')}
        />
      ),
    },
    {
      accessorKey: 'displayName',
      cell: ({ row }) => row.original.displayName || '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subUsers.columns.displayName')}
        />
      ),
    },
    {
      accessorKey: 'mobileNumber',
      cell: ({ row }) => row.original.mobileNumber || '-',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subUsers.columns.mobileNumber')}
        />
      ),
    },
    {
      accessorFn: (row) => row.roles ?? [],
      cell: ({ row }) => {
        const roles = row.getValue('roles') as PartyRole[]
        if (!roles.length) {
          return <div className='text-sm text-muted-foreground'>-</div>
        }

        return (
          <div className='flex max-w-80 flex-wrap gap-1'>
            {roles.map((role) => (
              <Badge
                className={cn('text-xs', partyRoleColors[role] ?? '')}
                key={role}
                variant='outline'
              >
                {t(PARTY_ROLE_TRANSLATION_KEYS[role] as never) || role}
              </Badge>
            ))}
          </div>
        )
      },
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subUsers.columns.roles')}
        />
      ),
      id: 'roles',
    },
    {
      cell: ({ row }) => {
        const isEnabled = row.original.enabled !== false
        const statusKey = isEnabled ? 'enabled' : 'disabled'
        const statusColorClass = subUserStatusColors[statusKey]
        return (
          <Badge
            className={cn('w-fit capitalize', statusColorClass)}
            variant='outline'
          >
            {isEnabled
              ? t('subUsers.status.enabled')
              : t('subUsers.status.disabled')}
          </Badge>
        )
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subUsers.columns.status')}
        />
      ),
      id: 'status',
    },
    {
      cell: ({ row }) => <SubUserRowActions row={row} />,
      id: 'actions',
      meta: { className: 'sticky left-0 bg-background' },
    },
  ]
}
