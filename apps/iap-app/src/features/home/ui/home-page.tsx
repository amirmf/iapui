import { FileText, PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HomeActionCard } from './home-action-card'
import { HomeSupportAlert } from './home-support-alert'
import { HomeWelcomeAlert } from './home-welcome-alert'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className='container px-4 py-8 sm:px-6 lg:px-8'>
      <HomeWelcomeAlert />
      <HomeSupportAlert />
      <section
        aria-label={t('myiap.nav.home')}
        className='grid gap-6 md:grid-cols-2'
      >
        <HomeActionCard
          description={t('myiap.myIapPage.createClaimDescription')}
          icon={PlusCircle}
          title={t('myiap.myIapPage.createClaimTitle')}
          to='/myclaims/create/'
        />
        <HomeActionCard
          description={t('myiap.myIapPage.myClaimsDescription')}
          icon={FileText}
          title={t('myiap.myIapPage.myClaimsTitle')}
          to='/myclaims/'
        />
      </section>
    </div>
  )
}
