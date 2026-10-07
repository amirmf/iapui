import { useState } from 'react'

import {
  AuditInformationDialog,
  ForcePasswordChangeDialog,
  useAuthSession,
} from '@iap/auth'
import { SupportWidget } from '@iap/support'
import { cn } from '@iap/ui'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'
import { customerUserNavigation } from './customer-user-navigation'

export function CustomerUserLayout() {
  const { t } = useTranslation()
  const { isLoading, logout, user } = useAuthSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (isLoading || !user) {
    return (
      <main
        aria-busy='true'
        className='grid min-h-dvh place-items-center bg-background p-6'
      >
        <p className='text-sm text-muted-foreground'>{t('shell.loading')}</p>
      </main>
    )
  }

  return (
    <div className='min-h-dvh bg-background' dir='rtl'>
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        items={customerUserNavigation}
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleCollapsed={() => setIsCollapsed((value) => !value)}
        roles={user.roles ?? []}
      />
      <div
        className={cn(
          'min-h-dvh p-2 transition-[margin] duration-300 motion-reduce:transition-none sm:p-4 lg:mr-72',
          isCollapsed && 'lg:mr-20'
        )}
      >
        <AdminHeader
          homePageUrl='/customer-user/'
          onLogout={logout}
          onOpenNavigation={() => setIsMobileOpen(true)}
          user={user}
        />
        <main
          className='mx-auto w-full max-w-[1600px] py-6'
          id='main-content'
          tabIndex={-1}
        >
          <Outlet />
        </main>
        <SupportWidget
          context={{
            isMyIap: false,
            pageKey: pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '__'),
          }}
        />
        <ForcePasswordChangeDialog />
        <AuditInformationDialog />
      </div>
    </div>
  )
}
