import { useState } from 'react'

import {
  AuditInformationDialog,
  ForcePasswordChangeDialog,
  useAuthSession,
} from '@iap/auth'
import { SupportFlowWidget } from '@iap/support'
import { cn } from '@iap/ui'
import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'

export function AuthenticatedLayout() {
  const { t } = useTranslation()
  const { isLoading, logout, user } = useAuthSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  if (isLoading || !user) {
    return (
      <main
        className='grid min-h-dvh place-items-center bg-background p-6'
        aria-busy='true'
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
        <SupportFlowWidget position='admin' />
        <ForcePasswordChangeDialog />
        <AuditInformationDialog />
      </div>
    </div>
  )
}
