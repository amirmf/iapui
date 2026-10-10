import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function MyIapFooter() {
  const { t } = useTranslation()

  const footerLinks = [
    { label: t('myiap.nav.home'), to: '/' },
    { label: t('myiap.nav.myClaims'), to: '/myclaims/' },
    { label: t('myiap.nav.createClaim'), to: '/myclaims/create/' },
  ] as const

  const currentYear = new Date().getFullYear()

  return (
    <footer className='hidden border-t bg-card md:block'>
      <div className='container px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <nav
            aria-label={t('myiap.nav.menu')}
            className='flex flex-wrap items-center gap-2'
          >
            {footerLinks.map((link) => (
              <Link
                className='whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-primary-600 dark:hover:text-primary-50'
                key={link.to}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className='text-sm text-gray-600 dark:text-gray-400'>
            {t('myiap.footer.copyright', {
              company: import.meta.env.VITE_LOGIN_COMPANY,
              year: currentYear,
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { MyIapFooter as AppFooter }
