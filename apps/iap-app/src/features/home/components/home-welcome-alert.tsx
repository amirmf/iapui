import { useAuthSession } from '@iap/auth'
import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function HomeWelcomeAlert() {
  const { user } = useAuthSession()
  const { t } = useTranslation()
  const userName =
    user?.displayName?.trim() || user?.username || t('myiap.myIapPage.guest')

  return (
    <aside className='mb-6 flex gap-3 rounded-xl border border-primary/50 bg-primary/5 p-4'>
      <Info
        aria-hidden='true'
        className='mt-0.5 size-5 shrink-0 text-primary'
      />
      <div>
        <h1 className='text-lg font-semibold'>
          {t('myiap.myIapPage.welcomeTitle', { name: userName })}
        </h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          {t('myiap.myIapPage.welcomeDescription')}
        </p>
        <p className='mt-2 text-sm text-muted-foreground'>
          {t('myiap.myIapPage.panelIntroduction')}
        </p>
      </div>
    </aside>
  )
}
