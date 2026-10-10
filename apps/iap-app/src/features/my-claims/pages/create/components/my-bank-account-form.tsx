import { useEffect } from 'react'

import {
  type MyBankAccountRequest,
  getIranianIbanBankName,
  myBankAccountFormSchema,
} from '@features/my-claims/model/my-bank-account-schema'
import myClaimRequestService from '@features/my-claims/services/my-claim-request-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button, Input } from '@iap/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function MyBankAccountForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation()
  const translate = t as (key: string, options?: unknown) => string
  const query = useQuery({
    queryKey: ['myBankAccount'],
    queryFn: () => myClaimRequestService.getMyBankAccount(),
    retry: false,
  })
  const form = useForm<MyBankAccountRequest>({
    resolver: zodResolver(myBankAccountFormSchema(translate)),
    defaultValues: { bankAccountNumber: '', bankAccountType: 'IBAN' },
  })
  useEffect(() => {
    if (query.data)
      form.reset({
        bankAccountNumber: query.data.bankAccountNumber ?? '',
        bankAccountType: 'IBAN',
      })
  }, [form, query.data])
  const mutation = useMutation({
    mutationFn: (payload: MyBankAccountRequest) =>
      query.data?.id
        ? myClaimRequestService.editMyBankAccount(query.data.id, payload)
        : myClaimRequestService.addMyBankAccount(payload),
    onSuccess: async () => {
      await query.refetch()
      toast.success(translate('myiap.myBankAccount.messages.saved'))
      onSuccess()
    },
  })
  const submit: SubmitHandler<MyBankAccountRequest> = (values) =>
    mutation.mutate(values)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='bankAccountNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>
                {translate('myiap.myBankAccount.fields.number')}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  dir='ltr'
                  numerical
                  disabled={query.isLoading}
                  placeholder={translate(
                    'myiap.myBankAccount.fields.numberPlaceholder'
                  )}
                />
              </FormControl>
              {getIranianIbanBankName(field.value) && (
                <p className='text-sm text-muted-foreground'>
                  {translate('myiap.myBankAccount.fields.bankName')}:{' '}
                  {getIranianIbanBankName(field.value)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-3'>
          <Button
            type='submit'
            disabled={mutation.isPending || query.isLoading}
          >
            {mutation.isPending
              ? translate('myiap.myBankAccount.actions.saving')
              : query.data?.id
                ? translate('myiap.myBankAccount.actions.edit')
                : translate('myiap.myBankAccount.actions.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
