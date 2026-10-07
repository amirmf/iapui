import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { RegistrationIdentity } from '@iap/api-types'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  NationalCodeField,
  PhoneField,
  TextField,
} from '@iap/forms'
import { Button, Tabs, TabsList, TabsTrigger } from '@iap/ui'
import { useMutation } from '@tanstack/react-query'
import { BookOpen } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  type PasswordFormValues,
  type RegistrationIdentityFormValues,
  createPasswordSchema,
  createRegistrationIdentitySchema,
  toRegistrationIdentity,
} from '../model/auth-schemas'
import { authService } from '../services/auth-service'
import { AuthCard } from './auth-card'
import type { AuthPageProps } from './auth-page.types'
import { PasswordFields } from './password-fields'

export function RegisterPage(props: AuthPageProps) {
  const { brand, onNavigate, footerActions } = props
  const { t } = useTranslation()
  const [identity, setIdentity] = useState<RegistrationIdentity | null>(null)

  return (
    <AuthCard
      brand={brand}
      footer={
        <>
          <div>
            <span>{t('auth.register.haveAccount')}</span>
            <Button
              className='text-primary mr-2 h-auto min-h-0 px-0 py-0 font-medium'
              onClick={() => onNavigate('login')}
              type='button'
              variant='link'
            >
              {t('auth.register.backToLogin')}
            </Button>
          </div>
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
      title={t('auth.register.title')}
    >
      {identity ? (
        <VerifyRegistrationForm
          identity={identity}
          onBack={() => setIdentity(null)}
          onNavigate={onNavigate}
        />
      ) : (
        <RequestRegistrationOtpForm onRequested={setIdentity} />
      )}
    </AuthCard>
  )
}

function RequestRegistrationOtpForm(props: {
  onRequested: (identity: RegistrationIdentity) => void
}) {
  const { onRequested } = props
  const { t } = useTranslation()
  const schema = useMemo(
    () => createRegistrationIdentitySchema(t as (key: string) => string),
    [t]
  )
  const form = useForm<RegistrationIdentityFormValues>({
    defaultValues: { nationalCode: '', nationalityType: 'IR', phoneNumber: '' },
    mode: 'all',
    resolver: zodResolver(schema),
  })
  const nationalityType = useWatch({
    control: form.control,
    name: 'nationalityType',
  })
  const requestOtp = useMutation({
    mutationFn: authService.requestSignupOtp,
    onSuccess: (_, identity) => onRequested(identity),
  })

  return (
    <Form {...form}>
      <form
        className='space-y-6'
        onSubmit={form.handleSubmit((values) =>
          requestOtp.mutate(toRegistrationIdentity(values))
        )}
      >
        <FormField
          control={form.control}
          name='nationalityType'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>{t('auth.register.nationality')}</FormLabel>
              <Tabs onValueChange={field.onChange} value={field.value}>
                <TabsList className='grid w-full grid-cols-2' dir='rtl'>
                  <TabsTrigger
                    className='data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground'
                    value='IR'
                  >
                    {t('auth.register.iranian')}
                  </TabsTrigger>
                  <TabsTrigger
                    className='data-[state=active]:bg-secondary data-[state=active]:text-primary-foreground'
                    value='FOREIGN'
                  >
                    {t('auth.register.foreign')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />
        <PhoneField
          control={form.control}
          label={t('auth.register.mobileNumber')}
          name='phoneNumber'
          required
        />
        {nationalityType === 'IR' ? (
          <NationalCodeField
            control={form.control}
            label={t('auth.register.nationalCode')}
            name='nationalCode'
            required
          />
        ) : (
          <TextField
            control={form.control}
            label={t('auth.register.foreignNationalCode')}
            name='nationalCode'
            required
          />
        )}
        <Button
          className='w-full'
          disabled={requestOtp.isPending}
          type='submit'
        >
          {requestOtp.isPending
            ? t('auth.register.requestingCode')
            : t('auth.register.requestCode')}
        </Button>
      </form>
    </Form>
  )
}

function VerifyRegistrationForm(props: {
  identity: RegistrationIdentity
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
  const verify = useMutation({
    mutationFn: authService.verifySignupOtp,
    onSuccess: () => onNavigate('login'),
  })

  return (
    <Form {...form}>
      <form
        className='space-y-6'
        onSubmit={form.handleSubmit((values) =>
          verify.mutate({
            ...identity,
            otpCode: values.otpCode,
            password: values.password,
          })
        )}
      >
        <p className='text-muted-foreground text-sm'>
          {t('auth.register.codeSentTo', {
            mobileNumber: identity.phoneNumber,
          })}
        </p>
        <TextField
          control={form.control}
          label={t('auth.register.otpCode')}
          name='otpCode'
          numerical
          required
        />
        <PasswordFields
          control={form.control}
          passwordConfirmationLabel={t('auth.register.passwordConfirmation')}
          passwordConfirmationName='verifyPassword'
          passwordLabel={t('auth.register.password')}
          passwordName='password'
        />
        <Button className='w-full' disabled={verify.isPending} type='submit'>
          {verify.isPending
            ? t('auth.register.submitting')
            : t('auth.register.submit')}
        </Button>
        <Button
          className='w-full'
          disabled={verify.isPending}
          onClick={onBack}
          type='button'
          variant='ghost'
        >
          {t('auth.register.changeNumber')}
        </Button>
      </form>
    </Form>
  )
}
