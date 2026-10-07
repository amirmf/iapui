import { useEffect, useMemo, useState } from 'react'

import {
  type FanhubIhioPrintCodeForm,
  fanhubIhioPrintCodeFormSchema,
  typedZodResolver,
} from '@features/claim-requests/model/claim-request-management-forms'
import { IhioPrintCodeResponse } from '@features/claim-requests/pages/claim-request-management/components/quick-buttons/fanhub-ihio-print-code-section/ihio-print-code-response'
import useClaimRequestManagementData from '@features/claim-requests/queries/use-claim-request-management-data'
import fanhubTaminService from '@features/claim-requests/services/fanhub-tamin-service'
import { Form, TextField } from '@iap/forms'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

export function ClaimRequestIhioPrescriptionsByPrintCodeSection() {
  const { t } = useTranslation()
  const { data: claimRequest } = useClaimRequestManagementData()
  const [open, setOpen] = useState(false)
  const nationalNumber = claimRequest?.extNationalCode
  const formSchema = useMemo(() => fanhubIhioPrintCodeFormSchema(t), [t])
  const form = useForm<FanhubIhioPrintCodeForm>({
    resolver: typedZodResolver(formSchema),
    defaultValues: { printCode: '' },
  })
  const inquiryMutation = useMutation({
    mutationFn: fanhubTaminService.inquireIhioPrescriptionsByPrintCode,
  })
  const { reset: resetInquiry } = inquiryMutation

  useEffect(() => {
    if (!open) {
      form.reset()
      resetInquiry()
    }
  }, [form, open, resetInquiry])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!inquiryMutation.isPending) setOpen(nextOpen)
  }

  const handleSubmit = ({ printCode }: FanhubIhioPrintCodeForm) => {
    if (!nationalNumber) return

    inquiryMutation.mutate({ nationalNumber, printCode })
  }

  return (
    <>
      <Button
        type='button'
        variant='default'
        size='xs'
        onClick={() => setOpen(true)}
        disabled={!nationalNumber}
        title={
          nationalNumber
            ? undefined
            : t('claimRequests.ihioPrintCode.missingClaimData')
        }
      >
        {t('claimRequests.ihioPrintCode.action')}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          presentation='reference'
          className='max-h-[90vh] min-w-0 overflow-y-auto sm:max-w-5xl'
        >
          <DialogHeader>
            <DialogTitle>{t('claimRequests.ihioPrintCode.title')}</DialogTitle>
            <DialogDescription>
              {t('claimRequests.ihioPrintCode.description')}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <TextField
                control={form.control}
                name='printCode'
                label={t('claimRequests.ihioPrintCode.fields.printCode')}
                disabled={inquiryMutation.isPending}
              />
              <DialogFooter className='gap-2 sm:space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => handleOpenChange(false)}
                  disabled={inquiryMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={inquiryMutation.isPending}>
                  {inquiryMutation.isPending
                    ? t('common.loading')
                    : t('claimRequests.ihioPrintCode.submit')}
                </Button>
              </DialogFooter>
            </form>
          </Form>

          <IhioPrintCodeResponse
            data={inquiryMutation.data}
            error={inquiryMutation.error}
            isError={inquiryMutation.isError}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
