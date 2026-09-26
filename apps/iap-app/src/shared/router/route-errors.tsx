import { Button } from '@iap/ui'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

function RouteErrorLayout(props: { description: string; title: string }) {
  const { description, title } = props
  const { t } = useTranslation()

  return (
    <main className='flex min-h-dvh items-center justify-center bg-background p-6 text-center'>
      <section className='max-w-md space-y-4'>
        <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
        <Button asChild>
          <Link to='/'>{t('routing.actions.goHome')}</Link>
        </Button>
      </section>
    </main>
  )
}

export function GeneralRouteError() {
  const { t } = useTranslation()

  return (
    <RouteErrorLayout
      description={t('routing.error.description')}
      title={t('routing.error.title')}
    />
  )
}

export function NotFoundRouteError() {
  const { t } = useTranslation()

  return (
    <RouteErrorLayout
      description={t('routing.notFound.description')}
      title={t('routing.notFound.title')}
    />
  )
}
