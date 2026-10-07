import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { PasswordResetIdentity } from '@iap/api-types'
import { Form, NationalCodeField, PhoneField, TextField } from '@iap/forms'
import { Button } from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  type PasswordFormValues,
  type PasswordResetIdentityFormValues,
  createPasswordResetIdentitySchema,
  createPasswordSchema,
  toPasswordResetIdentity,
} from '../model/auth-schemas'
import { authService } from '../services/auth-service'
import { AuthCard } from './auth-card'
import type { AuthPageProps } from './auth-page.types'
import { PasswordFields } from './password-fields'

export function PasswordResetPage(props: AuthPageProps) {
  const { brand, onNavigate, footerActions } = props
  const { t } = useTranslation()
  const [identity, setIdentity] = useState<PasswordResetIdentity | null>(null)

  return (
    <AuthCard
      brand={brand}
      description={
        identity
          ? t('auth.passwordReset.verifyDescription')
          : t('auth.passwordReset.description')
      }
      footer={
        <>
          <div>
            <span>{t('auth.passwordReset.remembered')}</span>
            <Button
              className='text-primary mr-2 h-auto min-h-0 px-0 py-0 font-medium'
              onClick={() => onNavigate('login')}
              type='button'
              variant='link'
            >
              {t('auth.passwordReset.backToLogin')}
            </Button>
          </div>
          {footerActions}
        </>
      }
      title={
        identity
          ? t('auth.passwordReset.verifyTitle')
          : t('auth.passwordReset.title')
      }
    >
      {identity ? (
        <ResetPasswordForm
          identity={identity}
          onBack={() => setIdentity(null)}
          onNavigate={onNavigate}
        />
      ) : (
        <RequestResetOtpForm onRequested={setIdentity} />
      )}
    </AuthCard>
  )
}

function RequestResetOtpForm(props: {
  onRequested: (identity: PasswordResetIdentity) => void
}) {
  const { onRequested } = props
  const { t } = useTranslation()
  const schema = useMemo(
    () => createPasswordResetIdentitySchema(t as (key: string) => string),
    [t]
  )
  const form = useForm<PasswordResetIdentityFormValues>({
    defaultValues: { mobileNumber: '', nationalCode: '' },
    mode: 'all',
    resolver: zodResolver(schema),
  })
  const requestOtp = useMutation({
    mutationFn: authService.requestPasswordResetOtp,
    onSuccess: (_, identity) => onRequested(identity),
  })

  return (
    <Form {...form}>
      <form
        className='space-y-6'
        onSubmit={form.handleSubmit((values) =>
          requestOtp.mutate(toPasswordResetIdentity(values))
        )}
      >
        <PhoneField
          control={form.control}
          label={t('auth.passwordReset.mobileNumber')}
          name='mobileNumber'
          required
        />
        <NationalCodeField
          control={form.control}
          label={t('auth.passwordReset.nationalCode')}
          name='nationalCode'
          required
        />
        <Button
          className='w-full'
          disabled={requestOtp.isPending}
          type='submit'
        >
          {requestOtp.isPending
            ? t('auth.passwordReset.requestingCode')
            : t('auth.passwordReset.requestCode')}
        </Button>
      </form>
    </Form>
  )
}

function ResetPasswordForm(props: {
  identity: PasswordResetIdentity
  onBack: () => void
  onNavigate: AuthPageProps['onNavigate']
}) {
  const { identity, onBack, onNavigate } = props
  const { t } = useTranslation()
  const schema = useMemo(
    () => createPasswordSchema(t as (key: string) => string),
    [t]
  )
  const form = useForm<PasswordFormValues>({
    defaultValues: { otpCode: '', password: '', verifyPassword: '' },
    mode: 'all',
    resolver: zodResolver(schema),
  })
  const resetPassword = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => onNavigate('login'),
  })

  return (
    <Form {...form}>
      <form
        className='space-y-6'
        onSubmit={form.handleSubmit((values) =>
          resetPassword.mutate({
            ...identity,
            otpCode: values.otpCode,
            password: values.password,
          })
        )}
      >
        <p className='text-muted-foreground text-sm'>
          {t('auth.passwordReset.codeSentTo', {
            mobileNumber: identity.mobileNumber,
          })}
        </p>
        <TextField
          control={form.control}
          label={t('auth.passwordReset.otpCode')}
          name='otpCode'
          numerical
          required
        />
        <PasswordFields
          control={form.control}
          passwordConfirmationLabel={t(
            'auth.passwordReset.passwordConfirmation'
          )}
          passwordConfirmationName='verifyPassword'
          passwordLabel={t('auth.passwordReset.password')}
          passwordName='password'
        />
        <Button
          className='w-full'
          disabled={resetPassword.isPending}
          type='submit'
        >
          {resetPassword.isPending
            ? t('auth.passwordReset.submitting')
            : t('auth.passwordReset.submit')}
        </Button>
        <Button
          className='w-full'
          disabled={resetPassword.isPending}
          onClick={onBack}
          type='button'
          variant='ghost'
        >
          {t('auth.passwordReset.changeIdentity')}
        </Button>
      </form>
    </Form>
  )
}
