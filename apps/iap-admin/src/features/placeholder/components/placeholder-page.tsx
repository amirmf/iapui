import { useTranslation } from 'react-i18next'

type PlaceholderPageProps = {
  titleKey: string
}

export function PlaceholderPage(props: PlaceholderPageProps) {
  const { titleKey } = props
  const { t } = useTranslation()

  return (
    <section className='rounded-[20px] border border-border bg-card p-6 shadow-sm'>
      <h1 className='text-2xl font-bold tracking-tight'>
        {t(titleKey as never)}
      </h1>
      <p className='mt-3 text-sm leading-6 text-muted-foreground'>
        {t('placeholder.description')}
      </p>
    </section>
  )
}
