import { Button } from '@iap/ui'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { useSupportQuestion } from '../../context'

interface SupportQuestionTableActionsProps {
  isLoading: boolean
  selectedSupportQuestionIds: string[]
  onRefetch: () => void
}

export function SupportQuestionTableActions({
  isLoading,
  selectedSupportQuestionIds,
  onRefetch,
}: SupportQuestionTableActionsProps) {
  const { t } = useTranslation()
  const setOpen = useSupportQuestion((state) => state.setOpen)

  return (
    <div className='mb-3 flex flex-wrap justify-end gap-2'>
      <Button
        variant='destructive'
        onClick={() => setOpen('bulkDelete')}
        disabled={selectedSupportQuestionIds.length === 0}
        className='space-x-2'
      >
        <IconTrash size={18} />
        <span>{t('supportQuestions.bulkDelete.button')}</span>
      </Button>
      <Button
        variant='outline'
        onClick={() => onRefetch()}
        disabled={isLoading}
        className='space-x-2'
      >
        <IconRefresh size={18} className={isLoading ? 'animate-spin' : ''} />
        <span>{t('supportQuestions.refresh')}</span>
      </Button>
      <Button onClick={() => setOpen('create')} className='space-x-2'>
        <IconPlus size={18} />
        <span>{t('supportQuestions.create')}</span>
      </Button>
    </div>
  )
}
