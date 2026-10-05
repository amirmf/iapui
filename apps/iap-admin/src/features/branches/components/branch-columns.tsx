import { useMemo } from 'react'

import { BranchRowActions } from '@features/branches/components/branch-row-actions'
import type { Branch } from '@iap/api-types'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<Branch>()

export function useBranchColumns() {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor('code', {
        cell: (context) => context.getValue() || '-',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('branches.columns.code')}
          />
        ),
      }),
      columnHelper.accessor('unitName', {
        cell: (context) => context.getValue(),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('branches.columns.unitName')}
          />
        ),
      }),
      columnHelper.accessor('tel', {
        cell: (context) => context.getValue(),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('branches.columns.tel')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <BranchRowActions row={context.row} />,
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background max-w-20 w-20' },
      }),
    ],
    [t]
  )
}
