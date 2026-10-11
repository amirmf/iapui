import type { ReactNode } from 'react'

import { AuditInformationDialog, ForcePasswordChangeDialog } from '@iap/auth'
import { SupportFlowProvider, SupportFlowWidget } from '@iap/support'
import { SidebarProvider, cn } from '@iap/ui'
import { Outlet } from '@tanstack/react-router'

import { AppSidebar } from './app-sidebar'
import { useSidebarData } from './data/sidebar-data'
import { Header } from './header'
import { LayoutLoading } from './layout-loading'
import { SearchProvider } from './search-context'

interface Props {
  children?: ReactNode
}

export function AuthenticatedLayout(props: Props) {
  const { children } = props
  const defaultOpen =
    typeof window !== 'undefined'
      ? localStorage.getItem('sidebar_state') === 'true'
      : true
  const { navGroups } = useSidebarData()

  return (
    <LayoutLoading>
      <SupportFlowProvider>
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar navList={navGroups} />
            <div
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'sm:transition-[width] sm:duration-300 sm:ease-in-out',
                'flex min-h-screen flex-col gap-6 bg-background px-2 py-2 supports-[height:100svh]:min-h-svh sm:px-2 sm:py-4 md:pb-24',
                'group-data-[scroll-locked=1]/body:h-full',
                'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
              )}
              id='content'
            >
              <Header />
              {children ? children : <Outlet />}
            </div>
            <SupportFlowWidget position='admin' />
            <ForcePasswordChangeDialog />
            <AuditInformationDialog />
          </SidebarProvider>
        </SearchProvider>
      </SupportFlowProvider>
    </LayoutLoading>
  )
}
