import { useEffect, useState } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
} from '@iap/ui'
import { ArrowRightIcon, EyeOffIcon, Trash2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type DeleteMethod = 'soft' | 'hard'

export type DeleteMethodDialogLabels = {
  back: string
  cancel: string
  confirmHardDescription: string
  confirmHardTitle: string
  confirmSoftDescription: string
  confirmSoftTitle: string
  dateLabel: string
  description: string
  hardDelete: string
  softDelete: string
  title: string
}

export type DeleteMethodDialogProps = {
  entityName: string
  isLoading?: boolean
  labels?: DeleteMethodDialogLabels
  onDelete: (method: DeleteMethod, thruDate?: string) => Promise<void> | void
  onOpenChange: (open: boolean) => void
  open: boolean
  preselectedMethod?: DeleteMethod
  resetDelay?: number
  showDatePicker?: boolean
}

type DeleteStage = 'select-method' | 'confirm'

export function DeleteMethodDialog(props: DeleteMethodDialogProps) {
  const {
    entityName,
    isLoading = false,
    labels: customLabels,
    onDelete,
    onOpenChange,
    open,
    preselectedMethod,
    resetDelay = 0,
    showDatePicker = true,
  } = props
  const { t } = useTranslation()
  const labels: DeleteMethodDialogLabels = customLabels ?? {
    back: t('common.back'),
    cancel: t('common.dialog.cancel'),
    confirmHardDescription: t('common.dialog.deleteDialog.confirmMessage'),
    confirmHardTitle: t('common.dialog.deleteDialog.permanentTitle'),
    confirmSoftDescription: t('common.softDeleteConfirm'),
    confirmSoftTitle: t('common.softDelete'),
    dateLabel: t('common.thruDate'),
    description: t('common.deleteMethodDescription'),
    hardDelete: t('common.delete'),
    softDelete: t('common.softDelete'),
    title: t('common.delete'),
  }
  const [stage, setStage] = useState<DeleteStage>(
    preselectedMethod ? 'confirm' : 'select-method'
  )
  const [selectedMethod, setSelectedMethod] = useState<DeleteMethod | null>(
    preselectedMethod ?? null
  )
  const [thruDate, setThruDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isBusy = isLoading || isSubmitting

  useEffect(() => {
    if (!open) {
      const timeoutId = window.setTimeout(() => {
        setStage(preselectedMethod ? 'confirm' : 'select-method')
        setSelectedMethod(preselectedMethod ?? null)
        setThruDate(new Date())
      }, resetDelay)
      return () => window.clearTimeout(timeoutId)
    }
  }, [open, preselectedMethod, resetDelay])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isBusy) onOpenChange(nextOpen)
  }

  const handleSelectMethod = (method: DeleteMethod) => {
    setSelectedMethod(method)
    setStage('confirm')
  }

  const handleBack = () => {
    if (isBusy) return

    setSelectedMethod(null)
    setStage('select-method')
  }

  const handleDelete = async () => {
    if (!selectedMethod || isBusy) return

    setIsSubmitting(true)
    try {
      await onDelete(
        selectedMethod,
        selectedMethod === 'soft' ? thruDate?.toISOString() : undefined
      )
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (stage === 'select-method') {
    return (
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent closeLabel={labels.cancel}>
          <DialogHeader>
            <DialogTitle>{labels.title}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p className='text-muted-foreground text-sm'>
              {labels.description.replace('{entityName}', entityName)}
            </p>
            <div className='grid gap-3 sm:grid-cols-2'>
              <Button
                disabled={isBusy}
                onClick={() => handleSelectMethod('soft')}
                type='button'
                variant='outline'
              >
                <EyeOffIcon aria-hidden='true' className='size-4' />
                {labels.softDelete}
              </Button>
              <Button
                className='border-destructive text-destructive hover:bg-destructive/10'
                disabled={isBusy}
                onClick={() => handleSelectMethod('hard')}
                type='button'
                variant='outline'
              >
                <Trash2Icon aria-hidden='true' className='size-4' />
                {labels.hardDelete}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const isHardDelete = selectedMethod === 'hard'
  const confirmTitle = isHardDelete
    ? labels.confirmHardTitle
    : labels.confirmSoftTitle
  const confirmDescription = isHardDelete
    ? labels.confirmHardDescription
    : labels.confirmSoftDescription

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDescription.replace('{entityName}', entityName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!isHardDelete && showDatePicker ? (
          <div className='space-y-2'>
            <Label>{labels.dateLabel}</Label>
            <DatePicker onChange={setThruDate} value={thruDate} />
          </div>
        ) : null}
        <AlertDialogFooter>
          {!preselectedMethod ? (
            <Button disabled={isBusy} onClick={handleBack} variant='outline'>
              <ArrowRightIcon
                aria-hidden='true'
                className='size-4 rtl:rotate-180'
              />
              {labels.back}
            </Button>
          ) : null}
          <AlertDialogCancel disabled={isBusy}>
            {labels.cancel}
          </AlertDialogCancel>
          <Button
            disabled={isBusy}
            onClick={() => void handleDelete()}
            variant='destructive'
          >
            {isHardDelete ? labels.hardDelete : labels.softDelete}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
