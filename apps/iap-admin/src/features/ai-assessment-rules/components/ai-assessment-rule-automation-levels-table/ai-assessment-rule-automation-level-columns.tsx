import { useMemo } from 'react'

import type { AiAssessmentRuleAutomationLevelItem } from '@iap/api-types'
import { Badge } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { DataTableColumnHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'

import { AI_ASSESSMENT_RULE_AUTOMATION_LEVEL_TRANSLATION_KEYS } from '../../constants/ai-assessment-rule-constant'
import { AiAssessmentRuleAutomationLevelActions } from './ai-assessment-rule-automation-level-actions'

interface UseAiAssessmentRuleAutomationLevelColumnsOptions {
  isPending: boolean
}

export function useAiAssessmentRuleAutomationLevelColumns({
  isPending,
}: UseAiAssessmentRuleAutomationLevelColumnsOptions) {
  const { t } = useTranslate()

  return useMemo<ColumnDef<AiAssessmentRuleAutomationLevelItem>[]>(
    () => [
      {
        accessorKey: 'automationLevel',
        cell: ({ row }) => {
          const level = row.original.automationLevel
          const translationKey = level
            ? AI_ASSESSMENT_RULE_AUTOMATION_LEVEL_TRANSLATION_KEYS[level]
            : undefined

          return translationKey ? (
            <Badge variant='outline'>{t(translationKey as never)}</Badge>
          ) : (
            t('common.notAvailable')
          )
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('aiAssessmentRules.fields.automationLevel')}
          />
        ),
      },
      {
        accessorKey: 'minThreshold',
        cell: ({ row }) =>
          row.original.minThreshold ?? t('common.notAvailable'),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('aiAssessmentRules.fields.minThreshold')}
          />
        ),
      },
      {
        accessorKey: 'maxThreshold',
        cell: ({ row }) =>
          row.original.maxThreshold ?? t('common.notAvailable'),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('aiAssessmentRules.fields.maxThreshold')}
          />
        ),
      },
      {
        cell: ({ row }) => (
          <AiAssessmentRuleAutomationLevelActions
            automationLevel={row.original}
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
