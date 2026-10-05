import { useEffect, useMemo } from 'react'

import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from '@features/user-account/model/user-account-form-schema'
import { userAccountService } from '@features/user-account/services/user-account-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormDescription, TextField } from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ResetPasswordDialog(props: {
  onOpenChange: (open: boolean) => void
  open: boolean
  userAccountId: string
}) {
  const { onOpenChange, open, userAccountId } = props
  const { t } = useTranslate()
  const schema = useMemo(() => resetPasswordSchema(t), [t])
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: { confirmPassword: '', password: '' },
    resolver: zodResolver(schema),
  })
  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      userAccountService.resetPassword(userAccountId, values.password),
    onSuccess: () => {
      toast.success(t('parties.userAccount.messages.passwordReset'))
      form.reset()
      onOpenChange(false)
    },
  })
  useEffect(() => {
    if (open) form.reset()
  }, [form, open])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) =>
        !nextOpen && !mutation.isPending && onOpenChange(false)
      }
    >
      <DialogContent>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('parties.userAccount.reset.title')}</DialogTitle>
          <DialogDescription>
            {t('parties.userAccount.reset.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <TextField
              autoComplete='new-password'
              control={form.control}
              label={t('parties.userAccount.fields.newPassword')}
              name='password'
              required
              type='password'
            />
            <FormDescription>
              <span className='font-medium'>
                {t('common.passwordRequirements.label')}
              </span>{' '}
              {t('common.passwordRequirements.description')}
            </FormDescription>
            <TextField
              autoComplete='new-password'
              control={form.control}
              label={t('parties.userAccount.fields.confirmPassword')}
              name='confirmPassword'
              required
              type='password'
            />
            <Button
              className='w-full'
              disabled={mutation.isPending}
              type='submit'
            >
              {t(
                mutation.isPending
                  ? 'parties.userAccount.buttons.resetting'
                  : 'parties.userAccount.buttons.resetPassword'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
