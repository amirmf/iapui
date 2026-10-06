import { Button } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconPlus } from '@tabler/icons-react'

import { useAiAssessmentRuleDetailsTableStore } from '../../context/store/ai-assessment-rule-details-table-store'

interface AiAssessmentRuleDetailCreateButtonProps {
  disabled: boolean
}

export function AiAssessmentRuleDetailCreateButton({
  disabled,
}: AiAssessmentRuleDetailCreateButtonProps) {
  const { t } = useTranslate()
  const setOpen = useAiAssessmentRuleDetailsTableStore((state) => state.setOpen)
  const setCurrentDetail = useAiAssessmentRuleDetailsTableStore(
    (state) => state.setCurrentDetail
  )

  return (
    <div className='flex justify-end'>
      <Button
        disabled={disabled}
        onClick={() => {
          setCurrentDetail(null)
          setOpen('create')
        }}
        size='sm'
      >
        <IconPlus className='size-4' />
        {t('aiAssessmentRules.ruleDetails.actions.create')}
      </Button>
    </div>
  )
}
