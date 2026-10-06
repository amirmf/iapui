import { useAssignementRule } from '@features/assignement-rules/context/store/assignement-rule-store'
import { Button, cn } from '@iap/ui'
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function AssignementRulesHeader(props: {
  selectedCount: number
  isLoading: boolean
  refetch: () => Promise<unknown>
}) {
  const { selectedCount, isLoading, refetch } = props
  const { t } = useTranslation()
  const setOpen = useAssignementRule((state) => state.setOpen)
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)
  return (
    <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
      <h2 className='text-xl font-bold tracking-tight'>
        {t('assignementRules.title')}
      </h2>
      <div className='flex gap-2'>
        <Button
          className='space-x-2'
          disabled={selectedCount === 0}
          onClick={() => setOpen('bulkDelete')}
          variant='destructive'
        >
          <IconTrash size={18} />
          <span>{t('assignementRules.bulkDelete.button')}</span>
        </Button>
        <Button
          className='space-x-2'
          disabled={isLoading}
          onClick={() => void refetch()}
          variant='outline'
        >
          <IconRefresh className={cn(isLoading && 'animate-spin')} size={18} />
          <span>{t('assignementRules.actions.refresh')}</span>
        </Button>
        <Button
          className='space-x-2'
          onClick={() => {
            setCurrentRow(null)
            setOpen('create')
          }}
        >
          <IconPlus size={18} />
          <span>{t('assignementRules.actions.create')}</span>
        </Button>
      </div>
    </div>
  )
}
