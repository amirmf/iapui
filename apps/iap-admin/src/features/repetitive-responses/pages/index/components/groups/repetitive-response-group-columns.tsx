import { useMemo } from 'react'

import { RepetitiveResponseGroupRowActions } from '@features/repetitive-responses/pages/index/components/groups/repetitive-response-group-row-actions'
import type { RepetitiveResponseGroup } from '@iap/api-types'
import { LongText } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<RepetitiveResponseGroup>()

export function useRepetitiveResponseGroupColumns() {
  const { t } = useTranslation()
  return useMemo(
    () => [
      columnHelper.accessor('title', {
        cell: (context) => (
          <LongText className='max-w-80 font-medium'>
            {context.getValue() ?? '-'}
          </LongText>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('repetitiveResponseGroups.columns.title')}
          />
        ),
      }),
      columnHelper.accessor('seqNum', {
        cell: (context) => (
          <div className='w-20 text-sm'>{context.getValue() ?? '-'}</div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('repetitiveResponseGroups.columns.seqNum')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => (
          <RepetitiveResponseGroupRowActions row={context.row} />
        ),
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background max-w-22 w-22' },
      }),
    ],
    [t]
  )
}
