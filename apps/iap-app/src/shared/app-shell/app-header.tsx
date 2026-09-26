import { useAuthSession } from '@iap/auth'
import { ThemeSwitcher } from '@iap/theme'
import { Link } from '@tanstack/react-router'
import { FileText, LogOut, PlusCircle, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AppPanelSwitcher } from './app-panel-switcher'

export function AppHeader() {
  const { logout, user } = useAuthSession()
  const { t } = useTranslation()
  const name = user?.displayName?.trim() || user?.username || ''
  const navigationItems = [
    { icon: undefined, label: t('myiap.nav.home'), to: '/' },
    { icon: FileText, label: t('myiap.nav.myClaims'), to: '/myclaims/' },
    {
      icon: PlusCircle,
      label: t('myiap.nav.createClaim'),
      to: '/myclaims/create/',
    },
  ] as const

  return (
    <header className='sticky top-0 z-50 border-b border-primary-700 bg-primary text-primary-foreground shadow-md'>
      <div className='container flex min-h-14 items-center gap-3 px-4 sm:px-6 lg:px-8'>
        <Link className='flex min-h-11 items-center gap-3' to='/'>
          <img
            alt={import.meta.env.VITE_LOGIN_COMPANY}
            className='size-10 shrink-0 object-contain'
            src={import.meta.env.VITE_LOGIN_LOGO}
          />
          <span className='hidden text-sm font-semibold tracking-tight sm:inline lg:text-lg'>
            {t('myiap.brand', {
              company: import.meta.env.VITE_LOGIN_COMPANY,
            })}
          </span>
        </Link>

        <nav
          aria-label={t('myiap.nav.menu')}
          className='mr-auto hidden gap-1 md:flex'
        >
          {navigationItems.map(({ label, to }) => (
            <Link
              activeOptions={{ exact: to === '/' }}
              activeProps={{
                'aria-current': 'page',
                className: 'bg-white/20 ring-1 ring-white/20',
              }}
              className='flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
              key={to}
              to={to}
            >
              {label}
            </Link>
          ))}
        </nav>

        <AppPanelSwitcher />

        <div className='flex items-center gap-2'>
          <ThemeSwitcher ariaLabel={t('common.theme.toggle')} />
          <span className='hidden max-w-40 truncate text-sm font-medium sm:block'>
            {name}
          </span>
          <span className='grid size-10 place-items-center' title={name}>
            <UserRound aria-hidden='true' className='size-5' />
          </span>
          <button
            aria-label={t('common.signOut')}
            className='grid size-11 place-items-center rounded-lg transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
            onClick={logout}
            type='button'
          >
            <LogOut aria-hidden='true' className='size-5' />
          </button>
        </div>
      </div>
    </header>
  )
}
