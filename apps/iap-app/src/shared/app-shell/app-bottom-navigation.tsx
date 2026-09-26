import { SupportNavigationButton } from '@iap/support'
import { Link } from '@tanstack/react-router'
import { FileText, Home, PlusCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AppBottomNavigation() {
  const { t } = useTranslation()
  const navigationItems = [
    { icon: Home, label: t('myiap.nav.home'), to: '/' },
    { icon: FileText, label: t('myiap.nav.myClaims'), to: '/myclaims/' },
    {
      icon: PlusCircle,
      label: t('myiap.nav.createClaim'),
      to: '/myclaims/create/',
    },
  ] as const

  return (
    <nav
      aria-label={t('myiap.nav.menu')}
      className='fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden'
    >
      <div className='flex h-16 items-stretch justify-around'>
        {navigationItems.map(({ icon: Icon, label, to }) => (
          <Link
            activeOptions={{ exact: to === '/' }}
            activeProps={{
              'aria-current': 'page',
              className: 'border-primary text-primary',
            }}
            className='flex w-full flex-col items-center justify-center gap-1 border-t-2 border-transparent px-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            key={to}
            to={to}
          >
            <Icon aria-hidden='true' className='size-6' />
            <span className='max-w-full truncate'>{label}</span>
          </Link>
        ))}
        <SupportNavigationButton />
      </div>
    </nav>
  )
}
