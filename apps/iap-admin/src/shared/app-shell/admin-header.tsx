import type { AuthUser } from '@iap/api-types'
import { Menu, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AdminBreadcrumb } from './admin-breadcrumb'
import { AdminPanelSwitcher } from './admin-panel-switcher'

type AdminHeaderProps = {
  homePageUrl?: string
  onLogout: () => void
  onOpenNavigation: () => void
  user: AuthUser
}

const formatter = new Intl.DateTimeFormat('fa-IR', {
  dateStyle: 'full',
})

export function AdminHeader({
  homePageUrl = '/',
  onLogout,
  onOpenNavigation,
  user,
}: AdminHeaderProps) {
  const { t } = useTranslation()
  const name = user.displayName?.trim() || user.username

  return (
    <header className='flex min-h-16 items-center gap-3 rounded-[20px] bg-card px-4 py-3 text-card-foreground shadow-sm sm:px-6'>
      <button
        aria-label={t('shell.openNavigation')}
        className='grid size-10 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden'
        onClick={onOpenNavigation}
        type='button'
      >
        <Menu aria-hidden='true' className='size-5' />
      </button>
      <div className='hidden h-6 w-px bg-border sm:block' />
      <AdminBreadcrumb homePageUrl={homePageUrl} />
      <div className='mr-auto flex items-center gap-2 sm:gap-3'>
        <p className='hidden text-sm text-muted-foreground sm:block'>
          {formatter.format(new Date())}
        </p>
        <AdminPanelSwitcher />
        <div className='hidden text-right sm:block'>
          <p className='text-sm font-semibold'>{name}</p>
          {user.email ? (
            <p className='text-xs text-muted-foreground'>{user.email}</p>
          ) : null}
        </div>
        <span className='grid size-9 place-items-center rounded-lg bg-surface-muted text-foreground'>
          <UserRound aria-hidden='true' className='size-5' />
        </span>
        <button
          className='min-h-10 rounded-lg px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={onLogout}
          type='button'
        >
          {t('shell.logout')}
        </button>
      </div>
    </header>
  )
}
