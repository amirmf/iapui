import { useState } from 'react'

import { useCreateMedicalCenterInvoice } from '@features/medical-center/queries/medical-center-invoice-query'
import type { Attachment } from '@iap/api-types'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { FileUploader } from '@modules/files'
import type { FileUploadOptions } from '@modules/files'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const emptyAttachments: Attachment[] = []
const ignoreAttachments: (attachments: Attachment[]) => void = () => undefined

export function MedicalCenterInvoiceUploadDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { open, onOpenChange } = props
  const { t: rawT } = useTranslation()
  const t = rawT as (key: string, options?: Record<string, unknown>) => string
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const mutation = useCreateMedicalCenterInvoice()

  const close = () => {
    onOpenChange(false)
  }

  const uploadInvoice = async (
    file: File,
    options: FileUploadOptions
  ): Promise<void> => {
    await mutation.mutateAsync({
      input: { file },
      options,
    })
    toast.success(t('medicalCenter.messages.created'))
    close()
  }

  const isPending = mutation.isPending || isUploadingFile

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen)
      }}
    >
      <DialogContent presentation='reference'>
        <DialogHeader>
          <DialogTitle>{t('medicalCenter.create.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <FileUploader
            value={emptyAttachments}
            onChange={ignoreAttachments}
            onUploadingChange={setIsUploadingFile}
            onUpload={uploadInvoice}
            maxFiles={1}
          />
          <DialogFooter>
            <Button
              presentation='reference'
              type='button'
              variant='outline'
              disabled={isPending}
              onClick={close}
            >
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
