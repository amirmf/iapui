import { FileClock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type PlaceholderPageProps = {
  titleKey:
    'myiap.nav.myClaims' | 'myiap.nav.createClaim' | 'myiap.nav.preAuths'
}

export function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { t } = useTranslation()
  return (
    <main className='container grid flex-1 place-items-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='max-w-md text-center'>
        <FileClock
          aria-hidden='true'
          className='mx-auto size-12 text-primary'
        />
        <h1 className='mt-5 text-xl font-semibold'>{t(titleKey)}</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          {t('placeholder.description')}
        </p>
      </div>
    </main>
  )
}
