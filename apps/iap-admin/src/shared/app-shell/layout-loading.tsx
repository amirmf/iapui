import type { PropsWithChildren } from 'react'

import { useAuthSession } from '@iap/auth'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LayoutLoading({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading, user } = useAuthSession()
  const { t } = useTranslation()

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div
        aria-busy='true'
        className='flex min-h-screen items-center justify-center bg-background text-foreground'
      >
        <Loader2 className='size-8 animate-spin' />
        <span className='ml-2'>{t('auth.login.loading')}</span>
      </div>
    )
  }

  return <>{children}</>
}

export default LayoutLoading
