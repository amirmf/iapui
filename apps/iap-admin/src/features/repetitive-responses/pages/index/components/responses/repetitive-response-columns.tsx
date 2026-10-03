import { RepetitiveResponseRowActions } from '@features/repetitive-responses/pages/index/components/responses/repetitive-response-row-actions'
import type { RepetitiveResponse } from '@iap/api-types'
import { LongText } from '@iap/ui'
import { DataTableColumnHeader } from '@shared/tables'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const helper = createColumnHelper<RepetitiveResponse>()
export function useRepetitiveResponseColumns() {
  const { t } = useTranslation()
  return useMemo(() => [
    helper.accessor('title', { cell: (context) => <LongText className='max-w-56 font-medium'>{context.getValue() ?? '-'}</LongText>, header: ({ column }) => <DataTableColumnHeader column={column} title={t('repetitiveResponses.columns.title')} /> }),
    helper.accessor('description', { cell: (context) => <LongText className='max-w-80'>{context.getValue() ?? '-'}</LongText>, header: ({ column }) => <DataTableColumnHeader column={column} title={t('repetitiveResponses.columns.response')} /> }),
    helper.accessor('seqNum', { cell: (context) => <span className='w-20 text-sm'>{context.getValue() ?? '-'}</span>, header: ({ column }) => <DataTableColumnHeader column={column} title={t('repetitiveResponses.columns.seqNum')} /> }),
    helper.accessor('usageCount', { cell: (context) => <span className='w-24 text-sm'>{context.getValue() ?? '-'}</span>, header: ({ column }) => <DataTableColumnHeader column={column} title={t('repetitiveResponses.columns.usageCount')} /> }),
    helper.display({ cell: (context) => <RepetitiveResponseRowActions row={context.row} />, id: 'actions', meta: { className: 'sticky left-0 bg-background' } }),
  ], [t])
}
