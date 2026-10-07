import { useMemo, useState } from 'react'

import {
  type ReturnFromPaymentSendAgainForm,
  returnFromPaymentSendAgainFormSchema,
} from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import {
  type AddObjectionRequest,
  type ClaimRequest,
} from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import claimRequestService from '@features/claim-requests/pages/claim-request-management/services/claim-request-management-service'
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

interface ReturnFromPaymentSendAgainDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  claimRequestId: string
  claimRequest?: ClaimRequest
  onSuccess?: () => Promise<unknown> | unknown
}

export function ReturnFromPaymentSendAgainDialog(
  props: ReturnFromPaymentSendAgainDialogProps
) {
  const { open, onOpenChange, claimRequestId, onSuccess, claimRequest } = props
  const { t } = useTranslation()
  const [openConfirm, setOpenConfirm] = useState(false)
  const formSchema = useMemo(() => returnFromPaymentSendAgainFormSchema(t), [t])
  const form = useForm<ReturnFromPaymentSendAgainForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      understood: false,
      description: '',
    },
  })

  const returnFromPaymentSendAgainMutation = useMutation({
    mutationFn: (values: ReturnFromPaymentSendAgainForm) => {
      const payload: AddObjectionRequest = {
        claimRequestId,
        description: values.description.trim(),
        claimRequestStatus: 'PAYMENT_RETURN_RESEND',
        isCheat: 'N',
      }
      return claimRequestService.submitObjection(payload)
    },
    onSuccess: async () => {
      toast.success(
        t('claimRequests.returnFromPaymentSendAgain.messages.success')
      )
      form.reset()
      setOpenConfirm(false)
      onOpenChange(false)
      await onSuccess?.()
    },
  })

  const isPending = returnFromPaymentSendAgainMutation.isPending

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
    returnFromPaymentSendAgainMutation.mutate(form.getValues())
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent presentation='reference'>
          <DialogHeader>
            <DialogTitle>
              {t('claimRequests.returnFromPaymentSendAgain.title')}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              id='return-from-payment-send-again-form'
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <div className='rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground'>
                <span>
                  {t(
                    'claimRequests.returnFromPaymentSendAgain.temporaryDescription1'
                  )}
                </span>
                <span className='font-medium text-text-primary'>
                  {' '}
                  {claimRequest?.outpatientDocAcceptanceExtId}{' '}
                </span>
                <span>
                  {t(
                    'claimRequests.returnFromPaymentSendAgain.temporaryDescription2'
                  )}
                </span>
                <span className='font-medium text-text-primary'>
                  {t(
                    'claimRequests.returnFromPaymentSendAgain.temporaryDescription3'
                  )}
                </span>
                <span>
                  {t(
                    'claimRequests.returnFromPaymentSendAgain.temporaryDescription4'
                  )}
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
                        {t(
                          'claimRequests.returnFromPaymentSendAgain.fields.understood'
                        )}
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TextareaField
                control={form.control}
                name='description'
                label={t(
                  'claimRequests.returnFromPaymentSendAgain.fields.description'
                )}
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
              form='return-from-payment-send-again-form'
              disabled={isPending}
            >
              {t('claimRequests.returnFromPaymentSendAgain.actions.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        presentation='reference'
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={t('claimRequests.returnFromPaymentSendAgain.confirm.title')}
        description={t(
          'claimRequests.returnFromPaymentSendAgain.confirm.description'
        )}
        confirmLabel={t(
          'claimRequests.returnFromPaymentSendAgain.confirm.confirm'
        )}
        confirmVariant='destructive'
        onConfirm={handleConfirm}
        isLoading={isPending}
      />
    </>
  )
}
