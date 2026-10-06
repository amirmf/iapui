import { useCallback, useEffect, useMemo } from 'react'

import type { AiAssessmentRule, AiAssessmentRuleDetail } from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { SimpleDataTable } from '@shared/tables'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { toast } from 'sonner'

import { useAiAssessmentRuleDetailsTableStore } from '../../context/store/ai-assessment-rule-details-table-store'
import { useUpdateAiAssessmentRuleMutation } from '../../queries/use-ai-assessment-rules'
import { createAiAssessmentRuleUpdateData } from '../../utils/create-ai-assessment-rule-update-data'
import { useAiAssessmentRuleDetailColumns } from './ai-assessment-rule-detail-columns'
import { AiAssessmentRuleDetailCreateButton } from './ai-assessment-rule-detail-create-button'
import { AiAssessmentRuleDetailDeleteDialog } from './ai-assessment-rule-detail-delete-dialog'
import { AiAssessmentRuleDetailFormDialog } from './ai-assessment-rule-detail-form-dialog'
import { replaceRuleDetail } from './ai-assessment-rule-detail-utils'

interface AiAssessmentRuleDetailsTableProps {
  onRefresh: () => void
  rule: AiAssessmentRule
}

type RuleDetailMutationAction = 'created' | 'deleted' | 'updated'

export function AiAssessmentRuleDetailsTable({
  onRefresh,
  rule,
}: AiAssessmentRuleDetailsTableProps) {
  const { t } = useTranslate()
  const open = useAiAssessmentRuleDetailsTableStore((state) => state.open)
  const currentDetail = useAiAssessmentRuleDetailsTableStore(
    (state) => state.currentDetail
  )
  const setOpen = useAiAssessmentRuleDetailsTableStore((state) => state.setOpen)
  const setCurrentDetail = useAiAssessmentRuleDetailsTableStore(
    (state) => state.setCurrentDetail
  )
  const reset = useAiAssessmentRuleDetailsTableStore((state) => state.reset)
  const ruleDetails = useMemo(() => rule.ruleDetails ?? [], [rule.ruleDetails])
  const update = useUpdateAiAssessmentRuleMutation()

  useEffect(() => () => reset(), [reset])

  const persistDetails = useCallback(
    (
      nextDetails: AiAssessmentRuleDetail[],
      nextMutationAction: RuleDetailMutationAction
    ) => {
      if (!rule.id) return
      update.mutate(
        {
          data: createAiAssessmentRuleUpdateData(rule, {
            automationLevels: rule.automationLevels ?? undefined,
            ruleDetails: nextDetails,
          }),
          id: rule.id,
        },
        {
          onSuccess: () => {
            toast.success(
              t(`aiAssessmentRules.ruleDetails.messages.${nextMutationAction}`)
            )
            setOpen(null)
            setCurrentDetail(null)
            onRefresh()
          },
        }
      )
    },
    [onRefresh, rule, setCurrentDetail, setOpen, t, update]
  )

  const handleDetailSubmit = useCallback(
    (nextDetail: AiAssessmentRuleDetail) => {
      persistDetails(
        open === 'edit' && currentDetail
          ? replaceRuleDetail(ruleDetails, currentDetail, nextDetail)
          : [...ruleDetails, nextDetail],
        open === 'edit' ? 'updated' : 'created'
      )
    },
    [currentDetail, open, persistDetails, ruleDetails]
  )

  const handleDelete = useCallback(() => {
    if (!currentDetail) return
    const index = ruleDetails.indexOf(currentDetail)
    if (index === -1) return
    persistDetails(
      ruleDetails.filter((_, detailIndex) => detailIndex !== index),
      'deleted'
    )
  }, [currentDetail, persistDetails, ruleDetails])

  const columns = useAiAssessmentRuleDetailColumns({
    isPending: update.isPending,
  })

  const table = useReactTable({
    columns,
    data: ruleDetails,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <AiAssessmentRuleDetailCreateButton
        disabled={!rule.id || update.isPending}
      />
      <SimpleDataTable
        emptyContent={t('aiAssessmentRules.inspector.emptyRuleDetails')}
        presentation='reference'
        table={table}
        tableWrapperClassName='overflow-x-auto rounded-md border'
      />
      <AiAssessmentRuleDetailFormDialog
        isPending={update.isPending}
        onSubmit={handleDetailSubmit}
      />
      <AiAssessmentRuleDetailDeleteDialog
        isPending={update.isPending}
        onConfirm={handleDelete}
      />
    </>
  )
}
