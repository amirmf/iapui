import { useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, TextField } from '@iap/forms'
import { Button } from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAuthStore } from '../context/store/auth-store'
import {
  type LoginFormValues,
  createLoginSchema,
  toLoginRequest,
} from '../model/auth-schemas'
import { authService } from '../services/auth-service'
import { AuthCard } from './auth-card'
import type { AuthPageProps } from './auth-page.types'

export function LoginPage(props: AuthPageProps) {
  const { brand, onNavigate, footerActions } = props
  const { t } = useTranslation()
  const setSession = useAuthStore((state) => state.setSession)
  const schema = useMemo(
    () => createLoginSchema(t as (key: string) => string),
    [t]
  )
  const form = useForm<LoginFormValues>({
    defaultValues: { password: '', username: '' },
    mode: 'all',
    resolver: zodResolver(schema),
  })
  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ token, user }) => {
      setSession({ accessToken: token, user })
    },
  })

  return (
    <AuthCard
      brand={brand}
      footer={
        <>
          <Button
            className='w-full'
            disabled={login.isPending}
            onClick={() => onNavigate('register')}
            type='button'
            variant='secondary'
          >
            {t('auth.login.register')}
          </Button>
          <Button asChild className='w-full' variant='outline'>
            <a
              href='/video/login-submit.mp4'
              rel='noopener noreferrer'
              target='_blank'
            >
              <BookOpen aria-hidden='true' className='mr-2 h-4 w-4' />
              {t('auth.login.tutorial')}
            </a>
          </Button>
          {footerActions}
        </>
      }
      title={t('auth.login.title')}
    >
      <Form {...form}>
        <form
          className='space-y-6'
          onSubmit={form.handleSubmit((values) =>
            login.mutate(toLoginRequest(values))
          )}
        >
          <TextField
            autoComplete='username'
            control={form.control}
            label={t('auth.login.username')}
            name='username'
            required
          />
          <TextField
            autoComplete='current-password'
            control={form.control}
            label={t('auth.login.password')}
            name='password'
            required
            type='password'
          />
          <Button className='w-full' disabled={login.isPending} type='submit'>
            {login.isPending
              ? t('auth.login.submitting')
              : t('auth.login.submit')}
          </Button>
          <Button
            className='w-full'
            disabled={login.isPending}
            onClick={() => onNavigate('password-reset')}
            type='button'
            variant='outline'
          >
            {t('auth.login.forgotPassword')}
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}
