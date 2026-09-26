import { Button, cn } from '@iap/ui'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DashboardReportHeader(props: {
  isFetching: boolean
  onRefresh: () => void
}) {
  const { isFetching, onRefresh } = props
  const { t } = useTranslation()

  return (
    <div className='mb-4 flex justify-end'>
      <Button disabled={isFetching} onClick={onRefresh} variant='outline'>
        <RefreshCw
          aria-hidden='true'
          className={cn('size-4', isFetching && 'animate-spin')}
        />
        {t('dashboard.refresh')}
      </Button>
    </div>
  )
}
