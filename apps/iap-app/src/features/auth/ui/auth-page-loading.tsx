import { useTranslation } from 'react-i18next'

export function AuthPageLoading() {
  const { t } = useTranslation()

  return (
    <div className='flex min-h-dvh items-center justify-center text-sm text-muted-foreground'>
      {t('shell.loading')}
    </div>
  )
}
