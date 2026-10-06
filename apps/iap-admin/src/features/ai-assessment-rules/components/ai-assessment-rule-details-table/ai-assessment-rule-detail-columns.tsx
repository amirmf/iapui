import { useMemo } from 'react'

import type { AiAssessmentRuleDetail } from '@iap/api-types'
import { LongText } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'

import { AiAssessmentRuleDetailActions } from './ai-assessment-rule-detail-actions'

interface UseAiAssessmentRuleDetailColumnsOptions {
  isPending: boolean
}

export function useAiAssessmentRuleDetailColumns({
  isPending,
}: UseAiAssessmentRuleDetailColumnsOptions) {
  const { t } = useTranslate()

  return useMemo<ColumnDef<AiAssessmentRuleDetail>[]>(
    () => [
      {
        accessorKey: 'docType',
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.docType?.docTypeCode}
            secondary={row.original.methodNames}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('aiAssessmentRules.fields.docTypeCode')}
            secondary={t('aiAssessmentRules.fields.methodNames')}
          />
        ),
      },
      {
        accessorKey: 'minThreshold',
        cell: ({ row }) => (
          <TwoLineCell
            primary={row.original.minThreshold}
            secondary={row.original.maxThreshold}
          />
        ),
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('aiAssessmentRules.fields.minThreshold')}
            secondary={t('aiAssessmentRules.fields.maxThreshold')}
          />
        ),
      },
      {
        accessorKey: 'prompt',
        cell: ({ row }) => <LongText>{row.original.prompt ?? '-'}</LongText>,
        header: ({ column }) => (
          <TwoLineHeader
            column={column}
            primary={t('aiAssessmentRules.fields.prompt')}
          />
        ),
        meta: { className: 'min-w-48' },
      },
      {
        cell: ({ row }) => (
          <AiAssessmentRuleDetailActions
            detail={row.original}
            disabled={isPending}
          />
        ),
        id: 'actions',
        meta: { className: 'w-20' },
      },
    ],
    [isPending, t]
  )
}
