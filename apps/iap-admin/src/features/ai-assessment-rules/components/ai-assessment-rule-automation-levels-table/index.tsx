import { useCallback, useEffect, useMemo } from 'react'

import type {
  AiAssessmentRule,
  AiAssessmentRuleAutomationLevelItem,
} from '@iap/api-types'
import { useTranslate } from '@shared/i18n/i18n'
import { SimpleDataTable } from '@shared/tables'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { toast } from 'sonner'

import { useAiAssessmentRuleAutomationLevelsTableStore } from '../../context/store/ai-assessment-rule-automation-levels-table-store'
import { useUpdateAiAssessmentRuleMutation } from '../../queries/use-ai-assessment-rules'
import { createAiAssessmentRuleUpdateData } from '../../utils/create-ai-assessment-rule-update-data'
import { useAiAssessmentRuleAutomationLevelColumns } from './ai-assessment-rule-automation-level-columns'
import { AiAssessmentRuleAutomationLevelCreateButton } from './ai-assessment-rule-automation-level-create-button'
import { AiAssessmentRuleAutomationLevelDeleteDialog } from './ai-assessment-rule-automation-level-delete-dialog'
import { AiAssessmentRuleAutomationLevelFormDialog } from './ai-assessment-rule-automation-level-form-dialog'
import { replaceAutomationLevel } from './ai-assessment-rule-automation-level-utils'

interface AiAssessmentRuleAutomationLevelsTableProps {
  onRefresh: () => void
  rule: AiAssessmentRule
}

type AutomationLevelMutationAction = 'created' | 'deleted' | 'updated'

export function AiAssessmentRuleAutomationLevelsTable({
  onRefresh,
  rule,
}: AiAssessmentRuleAutomationLevelsTableProps) {
  const { t } = useTranslate()
  const open = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.open
  )
  const currentAutomationLevel = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.currentAutomationLevel
  )
  const setOpen = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.setOpen
  )
  const setCurrentAutomationLevel =
    useAiAssessmentRuleAutomationLevelsTableStore(
      (state) => state.setCurrentAutomationLevel
    )
  const reset = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.reset
  )
  const automationLevels = useMemo(
    () => rule.automationLevels ?? [],
    [rule.automationLevels]
  )
  const update = useUpdateAiAssessmentRuleMutation()

  useEffect(() => () => reset(), [reset])

  const persistAutomationLevels = useCallback(
    (
      nextAutomationLevels: AiAssessmentRuleAutomationLevelItem[],
      nextMutationAction: AutomationLevelMutationAction
    ) => {
      if (!rule.id) return

      update.mutate(
        {
          data: createAiAssessmentRuleUpdateData(rule, {
            automationLevels: nextAutomationLevels,
            ruleDetails: rule.ruleDetails ?? undefined,
          }),
          id: rule.id,
        },
        {
          onSuccess: () => {
            toast.success(
              t(
                `aiAssessmentRules.automationLevels.messages.${nextMutationAction}`
              )
            )
            setOpen(null)
            setCurrentAutomationLevel(null)
            onRefresh()
          },
        }
      )
    },
    [onRefresh, rule, setCurrentAutomationLevel, setOpen, t, update]
  )

  const handleAutomationLevelSubmit = useCallback(
    (nextAutomationLevel: AiAssessmentRuleAutomationLevelItem) => {
      persistAutomationLevels(
        open === 'edit' && currentAutomationLevel
          ? replaceAutomationLevel(
              automationLevels,
              currentAutomationLevel,
              nextAutomationLevel
            )
          : [...automationLevels, nextAutomationLevel],
        open === 'edit' ? 'updated' : 'created'
      )
    },
    [automationLevels, currentAutomationLevel, open, persistAutomationLevels]
  )

  const handleDelete = useCallback(() => {
    if (!currentAutomationLevel) return

    const index = automationLevels.indexOf(currentAutomationLevel)
    if (index === -1) return

    persistAutomationLevels(
      automationLevels.filter(
        (_, automationLevelIndex) => automationLevelIndex !== index
      ),
      'deleted'
    )
  }, [automationLevels, currentAutomationLevel, persistAutomationLevels])

  const columns = useAiAssessmentRuleAutomationLevelColumns({
    isPending: update.isPending,
  })

  const table = useReactTable({
    columns,
    data: automationLevels,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <AiAssessmentRuleAutomationLevelCreateButton
        disabled={!rule.id || update.isPending}
      />
      <SimpleDataTable
        emptyContent={t('aiAssessmentRules.inspector.emptyAutomationLevels')}
        presentation='reference'
        table={table}
        tableWrapperClassName='overflow-x-auto rounded-md border'
      />
      <AiAssessmentRuleAutomationLevelFormDialog
        isPending={update.isPending}
        onSubmit={handleAutomationLevelSubmit}
      />
      <AiAssessmentRuleAutomationLevelDeleteDialog
        isPending={update.isPending}
        onConfirm={handleDelete}
      />
    </>
  )
}
