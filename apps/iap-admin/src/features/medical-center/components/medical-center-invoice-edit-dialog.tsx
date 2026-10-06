import { useEffect, useMemo } from 'react'

import { getMedicalCenterInvoiceStateOptions } from '@features/medical-center/constants/medical-center-constant'
import { useMedicalCenterInvoiceDialog } from '@features/medical-center/context/store/medical-center-invoice-dialog-store'
import {
  useMedicalCenterInvoice,
  useUpdateMedicalCenterInvoice,
} from '@features/medical-center/queries/medical-center-invoice-query'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type MedicalCenterInvoice,
  type MedicalCenterInvoiceEdit,
  createMedicalCenterInvoiceEditSchema,
} from '@iap/api-types'
import {
  DatePickerField,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextField,
} from '@iap/forms'
import { Button } from '@iap/ui'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { SingleSelect } from '@iap/ui'
import { type FieldNamesMarkedBoolean, useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const defaultValues: MedicalCenterInvoiceEdit = {
  documentNumber: '',
  date: undefined,
  printDate: undefined,
  issueDate: undefined,
  totalAmount: 0,
  state: 'SUBMITTED',
}

const dateFieldNames = ['date', 'printDate', 'issueDate'] as const

function toDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toFormValues(invoice: MedicalCenterInvoice): MedicalCenterInvoiceEdit {
  return {
    documentNumber: invoice.documentNumber ?? '',
    date: toDate(invoice.date),
    printDate: toDate(invoice.printDate),
    issueDate: toDate(invoice.issueDate),
    totalAmount: invoice.totalAmount ?? 0,
    state: invoice.state ?? 'SUBMITTED',
  }
}

function applyDirtyFormValues(
  invoice: MedicalCenterInvoice,
  values: MedicalCenterInvoiceEdit,
  dirtyFields: FieldNamesMarkedBoolean<MedicalCenterInvoiceEdit>
): MedicalCenterInvoice {
  return {
    ...invoice,
    ...(dirtyFields.documentNumber && {
      documentNumber: values.documentNumber,
    }),
    ...(dirtyFields.date && { date: values.date?.toISOString() ?? '' }),
    ...(dirtyFields.printDate && {
      printDate: values.printDate?.toISOString() ?? '',
    }),
    ...(dirtyFields.issueDate && {
      issueDate: values.issueDate?.toISOString() ?? '',
    }),
    ...(dirtyFields.totalAmount && { totalAmount: values.totalAmount }),
    ...(dirtyFields.state && { state: values.state }),
  }
}

export function MedicalCenterInvoiceEditDialog() {
  const { t: rawT, i18n } = useTranslation()
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
  const open = activeDialog === 'edit'
  const invoiceId = selectedInvoice?.id ?? null
  const schema = useMemo(
    () => createMedicalCenterInvoiceEditSchema(rawT),
    [rawT]
  )
  const form = useForm<MedicalCenterInvoiceEdit>({
    resolver: zodResolver(schema) as Resolver<MedicalCenterInvoiceEdit>,
    defaultValues,
  })
  const detailQuery = useMedicalCenterInvoice(invoiceId, open)
  const mutation = useUpdateMedicalCenterInvoice()

  useEffect(() => {
    if (open && detailQuery.data && !form.formState.isDirty) {
      form.reset(toFormValues(detailQuery.data))
    }
    if (!open) form.reset(defaultValues)
  }, [detailQuery.data, form, form.formState.isDirty, open])

  const close = () => {
    form.reset(defaultValues)
    closeDialog()
  }

  const handleSubmit = (values: MedicalCenterInvoiceEdit) => {
    if (!invoiceId || !detailQuery.data) return

    mutation.mutate(
      {
        id: invoiceId,
        invoice: applyDirtyFormValues(
          detailQuery.data,
          values,
          form.formState.dirtyFields
        ),
      },
      {
        onSuccess: () => {
          toast.success(t('medicalCenter.messages.updated'))
          close()
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !mutation.isPending) close()
      }}
    >
      <DialogContent presentation='reference' className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t('medicalCenter.edit.title')}</DialogTitle>
        </DialogHeader>
        {detailQuery.isError ? (
          <div className='space-y-3 text-sm text-destructive' role='alert'>
            <p>{t('medicalCenter.messages.detailError')}</p>
            <Button
              presentation='reference'
              type='button'
              variant='outline'
              onClick={() => detailQuery.refetch()}
            >
              {t('common.retry')}
            </Button>
          </div>
        ) : detailQuery.isLoading ? (
          <p className='text-sm text-muted-foreground'>
            {t('medicalCenter.loading')}
          </p>
        ) : detailQuery.data ? (
          <Form {...form}>
            <form
              className='space-y-5'
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <TextField
                  control={form.control}
                  name='documentNumber'
                  label={t('medicalCenter.fields.documentNumber')}
                  numerical
                />
                {dateFieldNames.map((name) => (
                  <DatePickerField
                    key={name}
                    control={form.control}
                    name={name}
                    label={t(`medicalCenter.fields.${name}`)}
                    placeholder={t(`medicalCenter.fields.${name}`)}
                    presentation='reference'
                    locale={i18n.language === 'fa' ? 'fa' : 'en'}
                    clearLabel={t('common.clear')}
                    clearable
                    showClear
                  />
                ))}
                <TextField
                  control={form.control}
                  name='totalAmount'
                  label={t('medicalCenter.fields.totalAmount')}
                  type='text'
                  numberWithComma
                />
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('medicalCenter.fields.state')}</FormLabel>
                      <SingleSelect
                        presentation='reference'
                        clearText={t('common.clear')}
                        selectText={t('common.select')}
                        loadingText={t('common.loading')}
                        emptyText={t('common.noResults')}
                        value={field.value}
                        onChange={field.onChange}
                        items={getMedicalCenterInvoiceStateOptions(rawT)}
                        placeholder={t('medicalCenter.fields.statePlaceholder')}
                        className='w-full'
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  presentation='reference'
                  type='button'
                  variant='outline'
                  disabled={mutation.isPending}
                  onClick={close}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  presentation='reference'
                  type='submit'
                  disabled={mutation.isPending || !invoiceId}
                >
                  {mutation.isPending ? t('form.updating') : t('form.update')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
