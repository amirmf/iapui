import { useState } from 'react'

import { Button } from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function DashboardPage() {
  const { t } = useTranslation()
  const [showReports, setShowReports] = useState(false)

  return (
    <section>
      <h1 className='mb-6 text-2xl font-bold tracking-tight'>
        {t('dashboard.title')}
      </h1>
      <div className='flex justify-center'>
        <Button onClick={() => setShowReports(true)}>
          {t('dashboard.reports.actions.showReport')}
        </Button>
      </div>
      {showReports ? (
        <p className='mt-6 text-center text-sm text-muted-foreground'>
          {t('placeholder.description')}
        </p>
      ) : null}
    </section>
  )
}
