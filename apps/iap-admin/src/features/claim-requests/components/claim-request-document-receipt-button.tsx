import { useMemo, useState } from 'react'

import {
  type ExportClaimRequestDocumentReceiptForm,
  exportClaimRequestDocumentReceiptFormSchema,
} from '@features/claim-requests/model/claim-request-document-receipt-schema'
import { claimRequestService } from '@features/claim-requests/services/claim-request-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, TextField } from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { IconFileTypePdf } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function ClaimRequestDocumentReceiptButton() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const schema = useMemo(
    () => exportClaimRequestDocumentReceiptFormSchema(t),
    [t]
  )
  const form = useForm<ExportClaimRequestDocumentReceiptForm>({
    defaultValues: { extMainNationalCode: '' },
    resolver: zodResolver(schema),
  })
  const mutation = useMutation({
    mutationFn: (request: ExportClaimRequestDocumentReceiptForm) =>
      claimRequestService.exportDocumentReceipt(request),
    onSuccess: (blob, { extMainNationalCode }) => {
      saveAs(blob, `document-receipt-${extMainNationalCode}.pdf`)
      toast.success(t('claimRequests.documentReceipt.downloaded'))
      form.reset()
      setOpen(false)
    },
  })
  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return
    if (!nextOpen) form.reset()
    setOpen(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type='button'
        presentation='reference'
        onClick={() => setOpen(true)}
        className='bg-yellow-200 text-yellow-950 hover:bg-yellow-300 focus-visible:ring-yellow-300/50 dark:bg-yellow-300 dark:text-yellow-950 dark:hover:bg-yellow-200'
      >
        <IconFileTypePdf size={18} aria-hidden='true' />
        <span>{t('claimRequests.documentReceipt.button')}</span>
      </Button>
      <DialogContent presentation='reference'>
        <DialogHeader>
          <DialogTitle>{t('claimRequests.documentReceipt.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <TextField
              control={form.control}
              name='extMainNationalCode'
              label={t('claimRequests.documentReceipt.nationalCode')}
              numerical
              inputMode='numeric'
              autoComplete='off'
              maxLength={10}
              disabled={mutation.isPending}
            />
            <DialogFooter>
              <Button
                presentation='reference'
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
                disabled={mutation.isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button
                presentation='reference'
                type='submit'
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? t('common.loading')
                  : t('claimRequests.documentReceipt.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
