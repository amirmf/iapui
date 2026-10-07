import { Button } from '@iap/ui'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { type QueryObserverResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useSupportFeature } from '../../context'

interface SupportFeatureTableActionsProps<TData> {
  isLoading: boolean
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportFeatureTableActions<TData>({
  isLoading,
  refetch,
}: SupportFeatureTableActionsProps<TData>) {
  const { t } = useTranslation()
  const setOpen = useSupportFeature((state) => state.setOpen)
  const setCurrentRow = useSupportFeature((state) => state.setCurrentRow)

  const openCreate = () => {
    setCurrentRow(null)
    setOpen('create')
  }

  return (
    <div className='flex gap-2'>
      <Button
        size='sm'
        variant='outline'
        disabled={isLoading}
        onClick={() => refetch()}
      >
        <IconRefresh className={isLoading ? 'animate-spin' : ''} size={16} />
        {t('supportFeatures.actions.refresh' as never)}
      </Button>
      <Button size='sm' onClick={openCreate}>
        <IconPlus size={16} />
        {t('supportFeatures.actions.create' as never)}
      </Button>
    </div>
  )
}
