import { useState } from 'react'

import {
  AuditInformationDialog,
  ForcePasswordChangeDialog,
  useAuthSession,
} from '@iap/auth'
import { SupportFlowWidget } from '@iap/support'
import { cn } from '@iap/ui'
import { Outlet, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'
import { agentNavigation } from './agent-navigation'

export function AgentLayout() {
  const { t } = useTranslation()
  const isAgentUserSignup = useLocation({
    select: (location) => /^\/agent\/users\/create\/?$/.test(location.pathname),
  })
  const Content = isAgentUserSignup ? 'div' : 'main'
  const { isLoading, logout, user } = useAuthSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
        items={agentNavigation}
        onCloseMobile={() => setIsMobileOpen(false)}
        onToggleCollapsed={() => setIsCollapsed((value) => !value)}
        roles={user.roles ?? []}
      />
      <div
        className={cn(
          'min-h-dvh p-2 transition-[margin] duration-300 motion-reduce:transition-none sm:p-4 lg:mr-72',
          isCollapsed && 'lg:mr-20',
          isAgentUserSignup && 'sm:px-2'
        )}
      >
        <AdminHeader
          homePageUrl='/agent/claim-requests/'
          onLogout={logout}
          onOpenNavigation={() => setIsMobileOpen(true)}
          user={user}
        />
        <Content
          className={cn(
            'mx-auto w-full max-w-[1600px] py-6',
            isAgentUserSignup && 'max-w-none pb-0 pt-6'
          )}
          id='main-content'
          tabIndex={-1}
        >
          <Outlet />
        </Content>
        <SupportFlowWidget position='admin' />
        <ForcePasswordChangeDialog />
        <AuditInformationDialog />
      </div>
    </div>
  )
}
