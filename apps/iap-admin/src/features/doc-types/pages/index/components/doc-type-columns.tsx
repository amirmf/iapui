import { useMemo } from 'react'

import { DocTypeRowActions } from '@features/doc-types/pages/index/components/doc-type-row-actions/doc-type-row-actions'
import type { AdminDocType } from '@iap/api-types'
import { LongText } from '@iap/ui'
import { TwoLineHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const columnHelper = createColumnHelper<AdminDocType>()

export function useDocTypeColumns() {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor('docType', {
        cell: (context) => (
          <span className='font-medium'>{context.getValue()}</span>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('docTypes.columns.docType')}
          />
        ),
      }),
      columnHelper.accessor('docTypeCode', {
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('docTypes.columns.docTypeCode')}
          />
        ),
      }),
      columnHelper.accessor('sequence', {
        cell: (context) => context.getValue() ?? t('common.notAvailable'),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('docTypes.columns.sequence')}
          />
        ),
      }),
      columnHelper.accessor('minThreshold', {
        cell: (context) => context.getValue() ?? t('common.notAvailable'),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('docTypes.columns.minThreshold')}
          />
        ),
      }),
      columnHelper.accessor('maxThreshold', {
        cell: (context) => context.getValue() ?? t('common.notAvailable'),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('docTypes.columns.maxThreshold')}
          />
        ),
      }),
      columnHelper.accessor('prompt', {
        cell: (context) => (
          <LongText className='max-w-48'>{context.getValue()}</LongText>
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('docTypes.columns.prompt')}
          />
        ),
      }),
      columnHelper.display({
        cell: (context) => <DocTypeRowActions row={context.row} />,
        id: 'actions',
        meta: { className: 'sticky left-0 bg-background' },
      }),
    ],
    [t]
  )
}
