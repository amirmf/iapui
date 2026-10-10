import type { ReactNode } from 'react'

import { AuditInformationDialog, ForcePasswordChangeDialog } from '@iap/auth'
import { SupportFlowProvider, SupportFlowWidget } from '@iap/support'
import { Outlet } from '@tanstack/react-router'

import { LayoutLoading } from './layout-loading'
import { MyIapBottomNav } from './my-iap-bottom-nav'
import { MyIapFooter } from './my-iap-footer'
import { MyIapHeader } from './my-iap-header'

type MyIapLayoutProps = {
  children?: ReactNode
}

export function MyIapLayout({ children }: MyIapLayoutProps) {
  return (
    <LayoutLoading>
      <SupportFlowProvider>
        <div
          className='flex min-h-screen flex-col bg-background text-foreground'
          dir='rtl'
        >
          <MyIapHeader />
          <main
            className='flex flex-1 flex-col bg-background pb-16 md:pb-0'
            id='main-content'
            tabIndex={-1}
          >
            {children ?? <Outlet />}
          </main>
          <MyIapFooter />
          <MyIapBottomNav />
          <SupportFlowWidget />
          <ForcePasswordChangeDialog />
          <AuditInformationDialog />
        </div>
      </SupportFlowProvider>
    </LayoutLoading>
  )
}

export { MyIapLayout as AppShell }
