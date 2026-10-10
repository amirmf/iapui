import { useAuthSession } from '@iap/auth'
import { useThemeStore } from '@iap/theme'
import { Alert, AlertDescription, AlertTitle } from '@iap/ui'
import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MyClaimWelcomeActions } from './my-claim-welcome-actions'

export function MyClaimWelcomeAlert() {
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const theme = useThemeStore((state) => state.theme)
  const userName =
    user?.displayName?.trim() || user?.username || t('myiap.myIapPage.guest')

  const navBackground = import.meta.env.VITE_MY_IAP_NAV_BACKGROUND ?? ''

  return (
    <Alert
      className='mb-6 border-primary/50 bg-primary/5 dark:bg-primary/10'
      style={{
        borderColor: navBackground || undefined,
        background: navBackground
          ? navBackground.replace('1)', '0.05)')
          : undefined,
      }}
    >
      <Info
        className='h-4 w-4'
        style={{
          color: theme === 'light' && navBackground ? navBackground : undefined,
        }}
      />
      <AlertTitle className='text-lg font-semibold'>
        {t('myiap.myIapPage.welcomeTitle', { name: userName })}
      </AlertTitle>
      <AlertDescription className='mt-2'>
        <p className='text-sm text-muted-foreground'>
          {t('myiap.myIapPage.welcomeDescription')}
        </p>
        <p className='text-sm text-muted-foreground'>
          {t('myiap.myIapPage.panelIntroduction')}
        </p>
        <MyClaimWelcomeActions />
      </AlertDescription>
    </Alert>
  )
}

export default MyClaimWelcomeAlert
