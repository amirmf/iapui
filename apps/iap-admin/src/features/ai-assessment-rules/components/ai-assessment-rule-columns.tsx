import type { AiAssessmentRule } from '@iap/api-types'
import { Badge, Tooltip, TooltipContent, TooltipTrigger, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { TwoLineCell, TwoLineHeader } from '@shared/tables'
import type { ColumnDef } from '@tanstack/react-table'

import {
  AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS,
  AI_ASSESSMENT_RULE_STATE_TRANSLATION_KEYS,
  AI_ASSESSMENT_RULE_STATUS_COLORS,
  AI_ASSESSMENT_RULE_STATUS_TRANSLATION_KEYS,
} from '../constants/ai-assessment-rule-constant'
import { AiAssessmentRuleRowActions } from './ai-assessment-rule-row-actions'

function getDocTypeLabels(rule: AiAssessmentRule): string[] {
  return (
    rule.docTypes
      ?.map((docType) => docType.docType ?? docType.docTypeCode)
      .filter((label): label is string => Boolean(label)) ?? []
  )
}

// eslint-disable-next-line react-refresh/only-export-components
function AiAssessmentRuleDocTypesCell({ rule }: { rule: AiAssessmentRule }) {
  const { t } = useTranslate()
  const docTypeLabels = getDocTypeLabels(rule)

  return (
    <div className='max-w-72 whitespace-normal text-sm'>
      <div className='flex flex-wrap gap-1'>
        {docTypeLabels.length
          ? docTypeLabels.map((label, index) => (
              <Tooltip key={`${label}-${index}`}>
                <TooltipTrigger asChild>
                  <Badge className='max-w-52 justify-start' variant='outline'>
                    <span className='min-w-0 truncate text-left'>{label}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent dir='auto'>{label}</TooltipContent>
              </Tooltip>
            ))
          : '-'}
      </div>
      <p className='mt-2 truncate text-xs font-normal text-muted-foreground'>
        {rule.ruleState
          ? t(
              AI_ASSESSMENT_RULE_STATE_TRANSLATION_KEYS[rule.ruleState] as never
            )
          : '-'}
      </p>
    </div>
  )
}

export function useAiAssessmentRuleColumns(): ColumnDef<AiAssessmentRule>[] {
  const { t } = useTranslate()
  return [
    {
      accessorKey: 'definitionType',
      cell: ({ row }) => (
        <TwoLineCell
          longText
          primary={
            row.original.definitionType
              ? t(
                  AI_ASSESSMENT_RULE_DEFINITION_TYPE_TRANSLATION_KEYS[
                    row.original.definitionType
                  ] as never
                )
              : null
          }
          secondary={row.original.extContractId}
          secondaryClassName='font-mono'
        />
      ),
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('aiAssessmentRules.fields.definitionType')}
          secondary={t('aiAssessmentRules.fields.extContractId')}
        />
      ),
    },
    {
      accessorKey: 'agreementTemplateCode',
      cell: ({ row }) => (
        <TwoLineCell
          longTextPrimary
          primary={row.original.agreementTemplateCode || '-'}
          secondary={row.original.extPolicyId}
          secondaryClassName='font-mono'
        />
      ),
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('aiAssessmentRules.fields.agreementTemplateCode')}
          secondary={t('aiAssessmentRules.fields.extPolicyId')}
        />
      ),
    },
    {
      accessorKey: 'docTypes',
      cell: ({ row }) => <AiAssessmentRuleDocTypesCell rule={row.original} />,
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('aiAssessmentRules.fields.docTypes')}
          secondary={t('aiAssessmentRules.fields.ruleState')}
        />
      ),
      meta: {
        className: 'w-56 max-w-56',
      },
    },
    {
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status
        const statusTranslationKey = status
          ? AI_ASSESSMENT_RULE_STATUS_TRANSLATION_KEYS[status]
          : undefined

        return (
          <div className='flex min-w-0 text-sm'>
            {status && statusTranslationKey ? (
              <Badge
                className={cn(
                  'w-fit',
                  AI_ASSESSMENT_RULE_STATUS_COLORS[status]
                )}
                variant='outline'
              >
                {t(statusTranslationKey as never)}
              </Badge>
            ) : (
              '-'
            )}
          </div>
        )
      },
      header: ({ column }) => (
        <TwoLineHeader
          column={column}
          primary={t('aiAssessmentRules.fields.status')}
        />
      ),
    },
    {
      cell: ({ row }) => <AiAssessmentRuleRowActions row={row} />,
      enableSorting: false,
      id: 'actions',
      meta: { className: 'sticky left-0 bg-background w-20 max-w-20' },
    },
  ]
}
