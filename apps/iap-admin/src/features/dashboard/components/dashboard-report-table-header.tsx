import { Button, cn } from '@iap/ui'
import { IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export interface DashboardReportTableHeaderProps {
  isLoading: boolean
  onRefetch: () => Promise<unknown> | void
}

export function DashboardReportTableHeader(
  props: DashboardReportTableHeaderProps
) {
  const { isLoading, onRefetch } = props
  const { t } = useTranslation()

  return (
    <div className='mb-4 flex flex-wrap justify-end gap-2'>
      <Button
        className='space-x-2'
        disabled={isLoading}
        onClick={onRefetch}
        variant='outline'
      >
        <IconRefresh className={cn(isLoading && 'animate-spin')} size={18} />
        <span>{t('dashboard.refresh')}</span>
      </Button>
    </div>
  )
}

export default DashboardReportTableHeader
