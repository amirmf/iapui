import { useMemo } from 'react'

import {
  NATIONALITY_TYPE_TRANSLATION_KEYS,
  PARTY_ROLE_TRANSLATION_KEYS,
  USER_ACCOUNT_STATUS_TRANSLATION_KEYS,
  partyRoleColors,
  userAccountStatusClasses,
} from '@features/user-account/constants/user-account-options'
import { UserAccountRowActions } from '@features/user-account/ui/user-account-row-actions'
import type { PartyRole, UserAccount } from '@iap/api-types'
import { Badge, LongText, cn, formatDateTime } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import {
  DataTableColumnHeader,
  TwoLineCell,
  TwoLineHeader,
} from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'

// eslint-disable-next-line react-refresh/only-export-components
function RoleList({ roles }: { roles: PartyRole[] }) {
  const { t } = useTranslate()
  if (!roles.length)
    return <div className='text-sm text-muted-foreground'>-</div>
  return (
    <div className='flex max-w-80 flex-wrap gap-1'>
      {roles.map((role) => (
        <Badge
          className={cn('text-xs', partyRoleColors[role])}
          key={role}
          variant='outline'
        >
          {t(PARTY_ROLE_TRANSLATION_KEYS[role] as never)}
        </Badge>
      ))}
    </div>
  )
}

export function useUserAccountColumns(): ColumnDef<UserAccount>[] {
  const { t } = useTranslate()
  return useMemo(
    () => [
      {
        accessorKey: 'username',
        cell: ({ row }) => (
          <div className='w-20 font-mono text-xs'>{row.original.username}</div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.columns.username')}
          />
        ),
        meta: {
          cellClassName: cn(
            'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            'sticky left-6 md:table-cell'
          ),
        },
      },
      {
        accessorKey: 'displayName',
        cell: ({ row }) => (
          <TwoLineCell
            longTextPrimary
            primary={row.original.displayName}
            primaryClassName='max-w-48'
            secondary={
              row.original.nationalityType
                ? t(
                    NATIONALITY_TYPE_TRANSLATION_KEYS[
                      row.original.nationalityType
                    ] as never
                  )
                : null
            }
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('parties.columns.displayName')}
            secondary={t('parties.columns.nationalityType')}
          />
        ),
      },
      {
        accessorKey: 'mobileNumber',
        cell: ({ row }) => (
          <div className='w-28 text-sm'>{row.original.mobileNumber || '-'}</div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.columns.mobileNumber')}
          />
        ),
      },
      {
        accessorKey: 'extId',
        cell: ({ row }) => (
          <LongText className='max-w-40 font-medium'>
            {row.original.extId || '-'}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.dialog.fields.extId')}
          />
        ),
      },
      {
        id: 'roles',
        accessorFn: (user) => user.roles ?? [],
        cell: ({ row }) => <RoleList roles={row.original.roles ?? []} />,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.columns.roles')}
          />
        ),
      },
      {
        id: 'branchLocations',
        accessorFn: (user) => user.branchLocations ?? [],
        cell: ({ row }) => (
          <LongText className='max-w-80'>
            {row.original.branchLocations
              ?.map((branch) => branch.unitName || branch.code)
              .filter(Boolean)
              .join('، ') || '-'}
          </LongText>
        ),
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.columns.branchLocations')}
          />
        ),
      },
      {
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.enabled === false ? 'disabled' : 'enabled'
          return (
            <Badge
              variant='outline'
              className={cn(
                'w-fit capitalize',
                userAccountStatusClasses[status]
              )}
            >
              {t(USER_ACCOUNT_STATUS_TRANSLATION_KEYS[status])}
            </Badge>
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.columns.status')}
          />
        ),
      },
      {
        accessorKey: 'createdAt',
        cell: ({ row }) => (
          <span className='text-sm'>
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('parties.columns.createdAt')}
          />
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => <UserAccountRowActions user={row.original} />,
        meta: { cellClassName: 'sticky left-0 w-30 max-w-60 bg-background' },
      },
    ],
    [t]
  )
}
