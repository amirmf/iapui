import { useMemo } from 'react'

import { useThemeStore } from '@iap/theme'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { AppPanelSwitcher } from './app-panel-switcher'
import { MyIapUserActions } from './my-iap-user-actions'

export function MyIapHeader() {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)

  const navLinks = useMemo(
    () => [
      { exact: true, label: t('myiap.nav.home'), to: '/' },
      { exact: true, label: t('myiap.nav.myClaims'), to: '/myclaims/' },
      {
        exact: false,
        label: t('myiap.nav.specialDiseases'),
        to: '/special-diseases/',
      },
      {
        exact: false,
        label: t('myiap.nav.createClaim'),
        to: '/myclaims/create/',
      },
    ],
    [t]
  )

  return (
    <>
      <header
        className='fixed top-0 z-50 w-full border-b border-transparent shadow-md'
        style={{
          background:
            theme === 'dark'
              ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND_DARK
              : import.meta.env.VITE_MY_IAP_NAV_BACKGROUND,
        }}
      >
        <div className='container flex h-14 items-center px-4 sm:px-6 lg:px-8'>
          <Link className='flex items-center gap-3' to='/'>
            <img
              alt={import.meta.env.VITE_LOGIN_COMPANY}
              className='h-10 w-10 min-w-10 object-cover object-center'
              src={import.meta.env.VITE_LOGIN_LOGO}
            />
            <span className='font-semibold tracking-tight text-white text-white/95 md:hidden lg:inline-block lg:text-lg'>
              {t('myiap.brand', {
                company: import.meta.env.VITE_LOGIN_COMPANY,
              })}
            </span>
          </Link>

          <div className='flex-1 md:hidden' />

          <nav
            aria-label={t('myiap.nav.menu')}
            className='ms-8 hidden flex-1 items-center gap-1 sm:gap-2 md:flex lg:gap-4'
          >
            {navLinks.map((link) => (
              <Link
                activeOptions={{
                  exact: link.exact,
                  includeSearch: false,
                }}
                activeProps={{
                  className: 'bg-white/20 ring-1 ring-white/20',
                }}
                className='whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-white/10 hover:text-white'
                key={link.to}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <AppPanelSwitcher />

          <MyIapUserActions />
        </div>
      </header>
      <div className='h-14 w-full' />
    </>
  )
}

export { MyIapHeader as AppHeader }
