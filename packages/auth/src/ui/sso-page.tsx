import { useEffect, useRef } from 'react'

import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../model/auth-store'
import { authService } from '../services/auth-service'
import type { AuthPageProps } from './auth-page.types'

type SsoPageProps = AuthPageProps & {
  onPendingChange?: (isPending: boolean) => void
}

export function SsoPage(props: SsoPageProps) {
  const { onNavigate, onPendingChange } = props
  const { t } = useTranslation()
  const attempted = useRef(false)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const ssoLogin = useMutation({
    mutationFn: authService.ssoLogin,
    onError: () => {
      clearSession()
      onNavigate('login')
    },
    onSuccess: ({ token, user }) => {
      setSession({ accessToken: token, user })
    },
  })

  useEffect(() => {
    onPendingChange?.(ssoLogin.isPending)
  }, [onPendingChange, ssoLogin.isPending])

  useEffect(() => {
    if (attempted.current) {
      return
    }

    attempted.current = true
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      clearSession()
      onNavigate('login')
      return
    }

    ssoLogin.mutate({ token })
  }, [clearSession, onNavigate, ssoLogin])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Loader2 aria-hidden='true' className='h-8 w-8 animate-spin' />
      <span className='ml-2'>{t('auth.sso.loading')}</span>
    </div>
  )
}
