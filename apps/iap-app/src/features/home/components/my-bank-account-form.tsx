import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button, Input, cn } from '@iap/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  type AddMyBankAccountRequest,
  myBankAccountFormSchema,
} from '../model/my-bank-account-schema'
import { bankAccountService } from '../services/bank-account-service'
import { IbanBankNameDescription } from './iban-bank-name-description'

interface MyBankAccountFormProps {
  onSuccess?: () => void
}

const defaultValues: AddMyBankAccountRequest = {
  bankAccountNumber: '',
  bankAccountType: 'IBAN',
}

export function MyBankAccountForm({ onSuccess }: MyBankAccountFormProps) {
  const { t } = useTranslation()

  const form = useForm<AddMyBankAccountRequest>({
    resolver: zodResolver(myBankAccountFormSchema(t)),
    defaultValues,
  })

  const myBankAccountQuery = useQuery({
    queryKey: ['myBankAccount'],
    queryFn: ({ signal }) => bankAccountService.getMyBankAccount({ signal }),
    retry: false,
  })

  useEffect(() => {
    const bankAccount = myBankAccountQuery.data

    if (bankAccount) {
      form.reset({
        bankAccountNumber: bankAccount.bankAccountNumber ?? '',
        bankAccountType: bankAccount.bankAccountType ?? 'IBAN',
      })
    }
  }, [form, myBankAccountQuery.data])

  const saveMutation = useMutation({
    mutationFn: (payload: AddMyBankAccountRequest) => {
      const bankAccountId = myBankAccountQuery.data?.id

      if (bankAccountId) {
        return bankAccountService.editMyBankAccount(bankAccountId, {
          ...myBankAccountQuery?.data,
          ...payload,
        })
      }

      return bankAccountService.addMyBankAccount(payload)
    },
    onSuccess: async () => {
      await myBankAccountQuery.refetch()
      toast.success(t('myiap.myBankAccount.messages.saved'))
      onSuccess?.()
    },
  })

  const onSubmit: SubmitHandler<AddMyBankAccountRequest> = (values) => {
    saveMutation.mutate(values)
  }

  const isEditing = Boolean(myBankAccountQuery.data?.id)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='bankAccountNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('myiap.myBankAccount.fields.number')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  dir='ltr'
                  placeholder={t(
                    'myiap.myBankAccount.fields.numberPlaceholder'
                  )}
                  className={cn(!field.value && 'text-right')}
                  disabled={myBankAccountQuery.isLoading}
                  numerical
                />
              </FormControl>
              <IbanBankNameDescription bankAccountNumber={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-3'>
          <Button
            type='submit'
            disabled={saveMutation.isPending || myBankAccountQuery.isLoading}
          >
            {saveMutation.isPending
              ? t('myiap.myBankAccount.actions.saving')
              : isEditing
                ? t('myiap.myBankAccount.actions.edit')
                : t('myiap.myBankAccount.actions.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default MyBankAccountForm
