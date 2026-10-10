import { useSupportFlow } from '@iap/support'
import { useThemeStore } from '@iap/theme'
import { Link } from '@tanstack/react-router'
import { Bot, FileText, Home, PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MyIapBottomNav() {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)
  const { hasInitialQuestions, isOpen, openSupport } = useSupportFlow()

  const navLinks = [
    {
      exact: true,
      icon: Home,
      label: t('myiap.nav.home'),
      to: '/',
    },
    {
      exact: true,
      icon: FileText,
      label: t('myiap.nav.myClaims'),
      to: '/myclaims/',
    },
    {
      exact: false,
      icon: PlusCircle,
      label: t('myiap.nav.createClaim'),
      to: '/myclaims/create/',
    },
    {
      exact: false,
      icon: FileText,
      label: t('myiap.nav.specialDiseases'),
      to: '/special-diseases/',
    },
  ] as const

  const activeColor =
    theme === 'dark'
      ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND_DARK
      : import.meta.env.VITE_MY_IAP_NAV_BACKGROUND

  return (
    <nav
      aria-label={t('myiap.nav.menu')}
      className='fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden'
    >
      <div className='flex h-16 items-center justify-around'>
        {navLinks.map(({ exact, icon: Icon, label, to }) => (
          <Link
            activeOptions={{
              exact,
              includeSearch: false,
            }}
            activeProps={{
              className: 'border-t-2',
              style: {
                borderColor: activeColor,
                color: activeColor,
              },
            }}
            className='flex h-full w-full flex-col items-center justify-center gap-1 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
            key={to}
            to={to}
          >
            <Icon aria-hidden='true' className='size-6' />
            <span className='truncate px-1 text-xs font-medium'>{label}</span>
          </Link>
        ))}
        {hasInitialQuestions ? (
          <button
            aria-label={t('supportFlow.openLabel')}
            className='flex h-full w-full flex-col items-center justify-center gap-1 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
            onClick={() => openSupport()}
            style={
              isOpen
                ? {
                    borderColor: activeColor,
                    borderTopWidth: 2,
                    color: activeColor,
                  }
                : undefined
            }
            type='button'
          >
            <Bot aria-hidden='true' className='size-6' />
            <span className='truncate px-1 text-xs font-medium'>
              {t('supportFlow.bottomNavLabel')}
            </span>
          </button>
        ) : null}
      </div>
    </nav>
  )
}

export { MyIapBottomNav as AppBottomNavigation }
