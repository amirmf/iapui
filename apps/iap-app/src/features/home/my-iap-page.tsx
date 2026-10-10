import { BadgePlus, ClipboardPlus, FileText, PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { HomeActionCard } from './components/home-action-card'
import { MyClaimWelcomeAlert } from './components/my-claim-welcome-alert'
import { MyIapSupportAlert } from './components/my-iap-support-alert'

export function MyIapPage() {
  const { t } = useTranslation()

  return (
    <div className='container px-4 py-8 sm:px-6 lg:px-8'>
      {/* Welcome Alert */}
      <MyClaimWelcomeAlert />
      <MyIapSupportAlert />

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
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

        <HomeActionCard
          description={t('myiap.myIapPage.createSpecialDiseaseDescription')}
          icon={BadgePlus}
          title={t('myiap.myIapPage.createSpecialDiseaseTitle')}
          to='/special-diseases/create/'
        />

        <HomeActionCard
          description={t('myiap.myIapPage.mySpecialDiseasesDescription')}
          icon={ClipboardPlus}
          title={t('myiap.myIapPage.mySpecialDiseasesTitle')}
          to='/special-diseases/'
          search={{ page: '0', nationalCode: '', diseaseName: '' }}
        />
      </div>
    </div>
  )
}

export default MyIapPage
