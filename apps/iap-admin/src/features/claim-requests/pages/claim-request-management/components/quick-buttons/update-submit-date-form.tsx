import { useEffect, useMemo } from 'react'

import {
  type UpdateSubmitDateFormValues,
  updateSubmitDateFormSchema,
} from '@features/claim-requests/model/claim-request-management-forms'
import { useClaimRequestManagementParams } from '@features/claim-requests/route-adapters/use-claim-request-management-params'
import claimRequestService from '@features/claim-requests/services/claim-request-management-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePickerField, Form, TextField } from '@iap/forms'
import { formatLocalDateTime as format } from '@iap/shared-lib'
import { Button } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface UpdateSubmitDateFormProps {
  submitDate?: string | null
  amount?: string | null
  onUpdated?: () => void
  onSuccess?: () => void
}

export function UpdateSubmitDateForm(props: UpdateSubmitDateFormProps) {
  const { submitDate, amount, onUpdated, onSuccess } = props
  const { t, i18n } = useTranslation()
  const schema = useMemo(() => updateSubmitDateFormSchema(t), [t])
  const { claimRequestId } = useClaimRequestManagementParams({
    from: '/_authenticated/claim-requests/$claimRequestId/claim-request-management/',
  })

  const form = useForm<UpdateSubmitDateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      submitDate: submitDate ? new Date(submitDate) : new Date(),
      amount: amount ?? undefined,
    },
  })

  useEffect(() => {
    form.reset({
      submitDate: submitDate ? new Date(submitDate) : new Date(),
      amount: amount ?? undefined,
    })
  }, [submitDate, amount, form])

  const updateSubmitDateMutation = useMutation({
    mutationFn: (payload: { submitDate: string; amount: number }) =>
      claimRequestService.updateClaim(claimRequestId, payload),
    onSuccess: async () => {
      toast.success(t('claimRequests.messages.submitDateAndAmountUpdated'))
      onUpdated?.()
      onSuccess?.()
    },
  })

  const onSubmit = (values: UpdateSubmitDateFormValues) => {
    updateSubmitDateMutation.mutate({
      submitDate: format(values.submitDate, 'yyyy-MM-dd'),
      amount: Number(values.amount),
    })
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <DatePickerField
          control={form.control}
          name='submitDate'
          label={t('claimRequests.dialog.fields.submitDate')}
          required
          presentation='reference'
          locale={i18n.language === 'fa' ? 'fa' : 'en'}
          showClear={false}
          editable
          placeholder={t('claimRequests.dialog.fields.submitDatePlaceholder')}
          maxDate={new Date(new Date().setHours(23, 59, 59, 999))}
        />
        <TextField
          control={form.control}
          name='amount'
          label={
            <>
              {t('claimRequests.dialog.fields.amount')} ({t('common.rial')})
            </>
          }
          required
          numberWithComma
        />

        <div className='flex justify-end'>
          <Button type='submit' disabled={updateSubmitDateMutation.isPending}>
            {updateSubmitDateMutation.isPending
              ? t('common.loading')
              : t('claimRequests.actions.updateSubmitDateAndAmount')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
