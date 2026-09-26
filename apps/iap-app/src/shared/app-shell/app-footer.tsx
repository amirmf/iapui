import { useTranslation } from 'react-i18next'

export function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className='hidden border-t border-border bg-card md:block'>
      <div className='container px-4 py-3 sm:px-6 lg:px-8'>
        <p className='text-sm text-muted-foreground'>
          {t('myiap.footer.copyright', {
            company: import.meta.env.VITE_LOGIN_COMPANY,
            year: new Date().getFullYear(),
          })}
        </p>
      </div>
    </footer>
  )
}
