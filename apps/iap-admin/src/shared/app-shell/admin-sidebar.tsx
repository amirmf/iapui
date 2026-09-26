import { canAccessPathByRole, canNotAccessPathByRole } from '@iap/auth'
import { cn } from '@iap/ui'
import { Link, useRouterState } from '@tanstack/react-router'
import { PanelRightClose, PanelRightOpen, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { adminNavigation } from './admin-navigation'

type AdminSidebarProps = {
  isCollapsed: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
  onToggleCollapsed: () => void
  roles: Parameters<typeof canAccessPathByRole>[0]
}

export function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleCollapsed,
  roles,
}: AdminSidebarProps) {
  const { t } = useTranslation()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const visibleItems = adminNavigation.filter(
    (item) =>
      canAccessPathByRole(roles, item.to) &&
      !canNotAccessPathByRole(roles, item.to)
  )

  return (
    <>
      <button
        aria-label={t('shell.closeNavigation')}
        className={cn(
          'fixed inset-0 z-30 bg-gray-950/40 transition-opacity lg:hidden',
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onCloseMobile}
        tabIndex={isMobileOpen ? 0 : -1}
        type='button'
      />
      <aside
        aria-label={t('shell.navigation')}
        className={cn(
          'fixed inset-y-0 right-0 z-40 flex w-72 flex-col border-l border-sidebar-border bg-sidebar px-3 py-4 shadow-xl transition-transform duration-300 motion-reduce:transition-none lg:translate-x-0 lg:shadow-none',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full',
          isCollapsed && 'lg:w-20'
        )}
      >
        <div className='flex h-12 items-center gap-3 px-2'>
          <img
            alt={import.meta.env.VITE_LOGIN_COMPANY}
            className='size-10 shrink-0 object-contain'
            src={import.meta.env.VITE_SIDEBAR_LOGIN_LOGO}
          />
          <span
            className={cn(
              'min-w-0 flex-1 text-sm font-medium text-sidebar-foreground',
              isCollapsed && 'lg:hidden'
            )}
          >
            {import.meta.env.VITE_LOGIN_TITLE}
          </span>
          <button
            aria-label={t('shell.closeNavigation')}
            className='grid size-10 place-items-center rounded-lg text-sidebar-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:hidden'
            onClick={onCloseMobile}
            type='button'
          >
            <X aria-hidden='true' className='size-5' />
          </button>
        </div>

        <nav
          className='mt-5 min-h-0 flex-1 overflow-y-auto'
          aria-label={t('shell.navigation')}
        >
          <ul className='space-y-1'>
            {visibleItems.map(({ icon: Icon, titleKey, to }) => {
              const isActive =
                to === '/' ? pathname === to : pathname.startsWith(to)

              return (
                <li key={to}>
                  <Link
                    activeOptions={{ exact: to === '/' }}
                    activeProps={{ 'aria-current': 'page' }}
                    className={cn(
                      'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                      isActive &&
                        'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                    onClick={onCloseMobile}
                    to={to as never}
                  >
                    <Icon aria-hidden='true' className='size-5 shrink-0' />
                    <span className={cn(isCollapsed && 'lg:hidden')}>
                      {t(titleKey as never)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          aria-label={
            isCollapsed
              ? t('shell.expandNavigation')
              : t('shell.collapseNavigation')
          }
          className='mt-3 hidden min-h-11 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:flex'
          onClick={onToggleCollapsed}
          type='button'
        >
          {isCollapsed ? (
            <PanelRightOpen aria-hidden='true' className='size-5' />
          ) : (
            <PanelRightClose aria-hidden='true' className='size-5' />
          )}
        </button>
      </aside>
    </>
  )
}
