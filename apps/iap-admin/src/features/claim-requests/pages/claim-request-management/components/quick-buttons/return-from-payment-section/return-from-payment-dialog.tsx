import { useMemo, useState } from 'react'

import {
  type ReturnFromPaymentForm,
  returnFromPaymentFormSchema,
} from '@features/claim-requests/model/claim-request-management-forms'
import {
  type AddObjectionRequest,
  type ClaimRequest,
} from '@features/claim-requests/model/claim-request-management-forms'
import claimRequestService from '@features/claim-requests/services/claim-request-management-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConfirmDialog } from '@iap/dialogs'
import { TextareaField } from '@iap/forms'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button } from '@iap/ui'
import { Checkbox } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ReturnFromPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  claimRequestId: string
  claimRequest?: ClaimRequest
  onSuccess?: () => Promise<unknown> | unknown
}

export function ReturnFromPaymentDialog(props: ReturnFromPaymentDialogProps) {
  const { open, onOpenChange, claimRequestId, onSuccess, claimRequest } = props
  const { t } = useTranslation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const formSchema = useMemo(() => returnFromPaymentFormSchema(t), [t])
  const form = useForm<ReturnFromPaymentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      understood: false,
      description: '',
    },
  })

  const returnFromPaymentMutation = useMutation({
    mutationFn: (values: ReturnFromPaymentForm) => {
      const payload: AddObjectionRequest = {
        claimRequestId,
        description: values.description.trim(),
        claimRequestStatus: 'PAYMENT_RETURN',
        isCheat: 'N',
      }
      return claimRequestService.submitObjection(payload)
    },
    onSuccess: async () => {
      toast.success(t('claimRequests.returnFromPayment.messages.success'))
      form.reset()
      setOpenConfirm(false)
      onOpenChange(false)
      await onSuccess?.()
    },
  })

  const isPending = returnFromPaymentMutation.isPending

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    onOpenChange(value)
    if (!value) {
      form.reset()
      setOpenConfirm(false)
    }
  }

  const handleSubmit = () => {
    setOpenConfirm(true)
  }

  const handleConfirm = () => {
    returnFromPaymentMutation.mutate(form.getValues())
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent presentation='reference'>
          <DialogHeader>
            <DialogTitle>
              {t('claimRequests.returnFromPayment.title')}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id='return-from-payment-form'
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <div className='rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground'>
                <span>
                  {t('claimRequests.returnFromPayment.temporaryDescription1')}
                </span>
                <span className='font-medium text-text-primary'>
                  {' '}
                  {claimRequest?.outpatientDocAcceptanceExtId}{' '}
                </span>
                <span>
                  {t('claimRequests.returnFromPayment.temporaryDescription2')}
                </span>
                <span className='font-medium text-text-primary'>
                  {t('claimRequests.returnFromPayment.temporaryDescription3')}
                </span>
                <span>
                  {t('claimRequests.returnFromPayment.temporaryDescription4')}
                </span>
              </div>
              <FormField
                control={form.control}
                name='understood'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer font-medium'>
                        {t('claimRequests.returnFromPayment.fields.understood')}
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TextareaField
                control={form.control}
                name='description'
                label={t('claimRequests.returnFromPayment.fields.description')}
                rows={4}
                disabled={isPending}
              />
            </form>
          </Form>
          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              {t('common.dialog.cancel')}
            </Button>
            <Button
              type='submit'
              form='return-from-payment-form'
              disabled={isPending}
            >
              {t('claimRequests.returnFromPayment.actions.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        presentation='reference'
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={t('claimRequests.returnFromPayment.confirm.title')}
        description={t('claimRequests.returnFromPayment.confirm.description')}
        confirmLabel={t('claimRequests.returnFromPayment.confirm.confirm')}
        confirmVariant='destructive'
        onConfirm={handleConfirm}
        isLoading={isPending}
      />
    </>
  )
}
