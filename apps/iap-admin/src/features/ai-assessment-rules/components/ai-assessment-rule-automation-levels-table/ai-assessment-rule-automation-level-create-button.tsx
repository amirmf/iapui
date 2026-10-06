import { Button } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconPlus } from '@tabler/icons-react'

import { useAiAssessmentRuleAutomationLevelsTableStore } from '../../context/store/ai-assessment-rule-automation-levels-table-store'

interface AiAssessmentRuleAutomationLevelCreateButtonProps {
  disabled: boolean
}

export function AiAssessmentRuleAutomationLevelCreateButton({
  disabled,
}: AiAssessmentRuleAutomationLevelCreateButtonProps) {
  const { t } = useTranslate()
  const setOpen = useAiAssessmentRuleAutomationLevelsTableStore(
    (state) => state.setOpen
  )
  const setCurrentAutomationLevel =
    useAiAssessmentRuleAutomationLevelsTableStore(
      (state) => state.setCurrentAutomationLevel
    )

  return (
    <div className='flex justify-end'>
      <Button
        disabled={disabled}
        onClick={() => {
          setCurrentAutomationLevel(null)
          setOpen('create')
        }}
        size='sm'
      >
        <IconPlus className='size-4' />
        {t('aiAssessmentRules.automationLevels.actions.create')}
      </Button>
    </div>
  )
}
