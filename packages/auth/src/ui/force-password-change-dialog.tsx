import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, TextField } from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, XIcon } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAuthSession } from '../model/auth-session'
import { useAuthStore } from '../model/auth-store'
import {
  type PasswordChangeFormValues,
  createPasswordChangeSchema,
  getPasswordRequirements,
  passwordRequirementTranslationKeys,
} from '../model/password-change-schema'
import { authService } from '../services/auth-service'

const defaultValues: PasswordChangeFormValues = {
  confirmNewPassword: '',
  currentPassword: '',
  newPassword: '',
}

export function ForcePasswordChangeDialog() {
  const { t } = useTranslation()
  const translate = t as (key: string) => string
  const { logout, user } = useAuthSession()
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const schema = useMemo(
    () => createPasswordChangeSchema(translate),
    [translate]
  )
  const isPasswordChangeForced = user?.isPasswordChangeForced === 'Y'
  const form = useForm<PasswordChangeFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })
  const newPassword = useWatch({ control: form.control, name: 'newPassword' })
  const requirements = getPasswordRequirements(newPassword)

  useEffect(() => {
    if (isPasswordChangeForced) {
      void queryClient.cancelQueries()
    }
  }, [isPasswordChangeForced, queryClient])

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordChangeFormValues) =>
      authService.changePassword({ currentPassword, newPassword }),
    onSuccess: ({ token, user: nextUser }) => {
      setSession({ accessToken: token, user: nextUser })
      void queryClient.invalidateQueries()
      form.reset(defaultValues)
      toast.success(t('auth.passwordChange.success'))
    },
  })

  if (!isPasswordChangeForced) return null

  return (
    <Dialog onOpenChange={() => undefined} open>
      <DialogContent
        className='sm:max-w-md'
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{t('auth.passwordChange.title')}</DialogTitle>
          <DialogDescription>
            {t('auth.passwordChange.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((values) =>
              changePasswordMutation.mutate(values)
            )}
          >
            <TextField
              autoComplete='current-password'
              control={form.control}
              label={t('auth.passwordChange.currentPassword')}
              name='currentPassword'
              type='password'
            />
            <TextField
              autoComplete='new-password'
              control={form.control}
              label={t('auth.passwordChange.newPassword')}
              name='newPassword'
              type='password'
            />
            <ul
              aria-label={t('auth.passwordChange.requirements.label')}
              aria-live='polite'
              className='space-y-1 text-sm'
            >
              {(
                Object.keys(
                  passwordRequirementTranslationKeys
                ) as PasswordRequirement[]
              ).map((requirement) => {
                const isMet = requirements[requirement]
                const Icon = isMet ? CheckIcon : XIcon

                return (
                  <li
                    className={
                      isMet
                        ? 'text-success flex items-center gap-2'
                        : 'text-destructive flex items-center gap-2'
                    }
                    key={requirement}
                  >
                    <Icon aria-hidden='true' className='size-4 shrink-0' />
                    {translate(passwordRequirementTranslationKeys[requirement])}
                  </li>
                )
              })}
            </ul>
            <TextField
              autoComplete='new-password'
              control={form.control}
              label={t('auth.passwordChange.confirmNewPassword')}
              name='confirmNewPassword'
              type='password'
            />
            <DialogFooter>
              <Button
                disabled={changePasswordMutation.isPending}
                onClick={logout}
                type='button'
                variant='destructive'
              >
                {t('common.signOut')}
              </Button>
              <Button
                disabled={
                  changePasswordMutation.isPending || !form.formState.isValid
                }
                type='submit'
              >
                {changePasswordMutation.isPending
                  ? t('auth.passwordChange.submitting')
                  : t('auth.passwordChange.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

type PasswordRequirement = keyof typeof passwordRequirementTranslationKeys
