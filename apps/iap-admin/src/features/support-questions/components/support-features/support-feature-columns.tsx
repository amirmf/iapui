import { useMemo } from 'react'

import { type SupportFeature } from '@iap/api-types'
import { Badge } from '@iap/ui'
import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { SupportFeatureRowActions } from './support-feature-row-actions'

export function useSupportFeatureColumns() {
  const { t } = useTranslation()

  return useMemo<ColumnDef<SupportFeature>[]>(
    () => [
      {
        accessorKey: 'featureKey',
        header: t('supportFeatures.columns.key' as never),
        enableSorting: true,
      },
      {
        accessorKey: 'title',
        header: t('supportFeatures.columns.title' as never),
        enableSorting: true,
      },
      {
        accessorKey: 'description',
        header: t('supportFeatures.columns.description' as never),
        cell: ({ row }) => (
          <span className='line-clamp-2'>
            {row.original.description || '-'}
          </span>
        ),
      },
      {
        id: 'pageKeys',
        header: t('supportFeatures.columns.pageKeys' as never),
        cell: ({ row }) => row.original.pageKeys?.join(', ') || '-',
      },
      {
        id: 'active',
        header: t('supportFeatures.columns.status' as never),
        cell: ({ row }) => (
          <Badge variant={row.original.active ? 'default' : 'secondary'}>
            {row.original.active
              ? t('supportFeatures.status.active' as never)
              : t('supportFeatures.status.inactive' as never)}
          </Badge>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => <SupportFeatureRowActions row={row} />,
      },
    ],
    [t]
  )
}
