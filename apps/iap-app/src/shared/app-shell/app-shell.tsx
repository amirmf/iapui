import {
  AuditInformationDialog,
  ForcePasswordChangeDialog,
  useAuthSession,
} from '@iap/auth'
import { SupportWidget } from '@iap/support'
import { Spinner } from '@iap/ui'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AppBottomNavigation } from './app-bottom-navigation'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'

export function AppShell() {
  const { isLoading, user } = useAuthSession()
  const { t } = useTranslation()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (isLoading || !user) {
    return (
      <main
        aria-busy='true'
        className='grid min-h-dvh place-items-center bg-background p-6'
      >
        <Spinner label={t('shell.loading')} size='lg' />
      </main>
    )
  }

  return (
    <div className='flex min-h-dvh flex-col bg-background' dir='rtl'>
      <AppHeader />
      <main
        className='flex flex-1 flex-col pb-16 md:pb-0'
        id='main-content'
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <AppFooter />
      <AppBottomNavigation />
      <SupportWidget
        context={{
          isMyIap: true,
          pageKey:
            pathname === '/'
              ? 'panel-root'
              : pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '__'),
        }}
      />
      <ForcePasswordChangeDialog />
      <AuditInformationDialog />
    </div>
  )
}
