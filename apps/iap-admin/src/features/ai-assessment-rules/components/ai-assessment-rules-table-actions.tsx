import { Button } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'

import { useAiAssessmentRule } from '../context/store/ai-assessment-rule-store'

interface AiAssessmentRulesTableActionsProps {
  hasSelection: boolean
  isRefreshing: boolean
  onRefresh: () => void
}

export function AiAssessmentRulesTableActions({
  hasSelection,
  isRefreshing,
  onRefresh,
}: AiAssessmentRulesTableActionsProps) {
  const { t } = useTranslate()
  const setOpen = useAiAssessmentRule((state) => state.setOpen)
  const setCurrentRow = useAiAssessmentRule((state) => state.setCurrentRow)

  return (
    <div className='flex gap-2'>
      <Button
        disabled={!hasSelection}
        onClick={() => setOpen('bulkDelete')}
        variant='destructive'
      >
        <IconTrash className='size-4' />
        {t('aiAssessmentRules.actions.bulkDelete')}
      </Button>
      <Button disabled={isRefreshing} onClick={onRefresh} variant='outline'>
        <IconRefresh
          className={isRefreshing ? 'size-4 animate-spin' : 'size-4'}
        />
        {t('aiAssessmentRules.actions.refresh')}
      </Button>
      <Button
        onClick={() => {
          setCurrentRow(null)
          setOpen('create')
        }}
      >
        <IconPlus className='size-4' />
        {t('aiAssessmentRules.actions.create')}
      </Button>
    </div>
  )
}
