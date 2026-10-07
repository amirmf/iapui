import { Button } from '@iap/ui'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { type QueryObserverResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useSupportPage } from '../../context'

interface SupportPageTableActionsProps<TData> {
  isLoading: boolean
  refetch: () => Promise<QueryObserverResult<TData>>
}

export function SupportPageTableActions<TData>({
  isLoading,
  refetch,
}: SupportPageTableActionsProps<TData>) {
  const { t } = useTranslation()
  const setOpen = useSupportPage((state) => state.setOpen)
  const setCurrentRow = useSupportPage((state) => state.setCurrentRow)

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
        {t('supportPages.actions.refresh' as never)}
      </Button>
      <Button size='sm' onClick={openCreate}>
        <IconPlus size={16} />
        {t('supportPages.actions.create' as never)}
      </Button>
    </div>
  )
}
