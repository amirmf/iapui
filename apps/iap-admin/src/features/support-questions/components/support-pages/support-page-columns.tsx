import { useMemo } from 'react'

import { type SupportPage } from '@iap/api-types'
import { Badge } from '@iap/ui'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { SupportPageRowActions } from './support-page-row-actions'

export function useSupportPageColumns() {
  const { t } = useTranslation()

  return useMemo<ColumnDef<SupportPage>[]>(
    () => [
      {
        accessorKey: 'pageKey',
        header: t('supportPages.columns.key' as never),
        enableSorting: true,
      },
      {
        accessorKey: 'title',
        header: t('supportPages.columns.title' as never),
        enableSorting: true,
      },
      {
        accessorKey: 'description',
        header: t('supportPages.columns.description' as never),
        cell: ({ row }) => (
          <span className='line-clamp-2'>
            {row.original.description || '-'}
          </span>
        ),
      },
      {
        id: 'active',
        header: t('supportPages.columns.status' as never),
        cell: ({ row }) => (
          <Badge variant={row.original.active ? 'default' : 'secondary'}>
            {row.original.active
              ? t('supportPages.status.active' as never)
              : t('supportPages.status.inactive' as never)}
          </Badge>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => <SupportPageRowActions row={row} />,
      },
    ],
    [t]
  )
}
