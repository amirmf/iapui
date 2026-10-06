import { MEDICAL_CENTER_INVOICE_STATE_TRANSLATION_KEYS } from '@features/medical-center/constants/medical-center-constant'
import { useMedicalCenterInvoiceDialog } from '@features/medical-center/context/store/medical-center-invoice-dialog-store'
import { useMedicalCenterInvoice } from '@features/medical-center/queries/medical-center-invoice-query'
import type { Attachment } from '@iap/api-types'
import type { MedicalCenterInvoice } from '@iap/api-types'
import { Button } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { Separator } from '@iap/ui'
import { FileViewer } from '@modules/files'
import { ReadonlyItems } from '@shared/components/readonly-items'
import { useTranslation } from 'react-i18next'

function getInvoiceFileAttachments(
  invoice: MedicalCenterInvoice
): Attachment[] {
  const file = invoice.invoiceFile

  if (
    !file?.filename ||
    !file.contentType ||
    file.size === undefined ||
    !file.uploadedAt ||
    !file.objectName ||
    !file.bucketName
  ) {
    return []
  }

  return [
    {
      id: file.id,
      filename: file.filename,
      fileType: file.contentType,
      fileSize: file.size,
      uploadDate: file.uploadedAt,
      minioObjectName: file.objectName,
      bucketName: file.bucketName,
    },
  ]
}

export function MedicalCenterInvoiceDetailDialog() {
  const { t: rawT } = useTranslation()
  const t = rawT as (key: string, options?: Record<string, unknown>) => string
  const activeDialog = useMedicalCenterInvoiceDialog(
    (state) => state.activeDialog
  )
  const selectedInvoice = useMedicalCenterInvoiceDialog(
    (state) => state.selectedInvoice
  )
  const closeDialog = useMedicalCenterInvoiceDialog(
    (state) => state.closeDialog
  )
  const open = activeDialog === 'view'
  const invoiceId = selectedInvoice?.id ?? null
  const query = useMedicalCenterInvoice(invoiceId, open)
  const invoice = query.data
  const attachments = invoice ? getInvoiceFileAttachments(invoice) : []
  const details = invoice
    ? [
        ['documentNumber', invoice.documentNumber],
        ['date', invoice.date],
        ['printDate', invoice.printDate],
        ['issueDate', invoice.issueDate],
        ['totalAmount', invoice.totalAmount?.toLocaleString()],
        [
          'state',
          invoice.state
            ? t(MEDICAL_CENTER_INVOICE_STATE_TRANSLATION_KEYS[invoice.state])
            : undefined,
        ] as const,
        ['recordCount', invoice.records.length.toLocaleString()],
      ]
    : []

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeDialog()}>
      <DialogContent
        presentation='reference'
        className='max-h-[85vh] overflow-y-auto sm:max-w-4xl'
      >
        <DialogHeader>
          <DialogTitle>{t('medicalCenter.details.title')}</DialogTitle>
        </DialogHeader>
        {query.isLoading ? (
          <p className='text-sm text-muted-foreground'>
            {t('medicalCenter.loading')}
          </p>
        ) : query.isError ? (
          <div className='space-y-3 text-sm text-destructive' role='alert'>
            <p>{t('medicalCenter.messages.detailError')}</p>
            <Button
              presentation='reference'
              type='button'
              variant='outline'
              onClick={() => query.refetch()}
            >
              {t('common.retry')}
            </Button>
          </div>
        ) : invoice ? (
          <div className='space-y-6'>
            <div className='grid gap-2 sm:grid-cols-2'>
              {details.map(([key, value]) => (
                <ReadonlyItems
                  key={key}
                  title={t(`medicalCenter.fields.${key}`)}
                  value={value || '-'}
                  className='rounded-md border border-s-2 border-s-primary/40 px-3 py-2'
                  classNameTitle='text-muted-foreground'
                  classNameValue='min-h-0 px-0 font-medium'
                />
              ))}
            </div>

            {attachments.length > 0 ? (
              <>
                <Separator />
                <FileViewer
                  attachments={attachments}
                  transformComponentWrapperStyle={{ height: '30vh' }}
                />
              </>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
