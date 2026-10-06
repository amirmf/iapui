import { useEffect, useMemo } from 'react'

import { getAgreementStatusOptions } from '@features/agreements/constants/agreement-status-options'
import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import { agreementService } from '@features/agreements/services/agreement-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type Agreement,
  type AgreementForm,
  agreementFormSchema,
} from '@iap/api-types'
import {
  DatePickerField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextField,
} from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormInput = z.input<ReturnType<typeof agreementFormSchema>>

function defaults(row?: Agreement | null): AgreementForm {
  return {
    code: row?.code ?? '',
    extContractId: row?.extContractId?.toString() ?? '',
    extLocation: row?.extLocation ?? '',
    extPlanId: row?.extPlanId?.toString() ?? '',
    extPolicyId: row?.extPolicyId?.toString() ?? '',
    fromDate: row?.fromDate ? new Date(row.fromDate) : new Date(),
    overrideRatio: row?.overrideRatio?.toString() ?? '',
    status: row?.status ?? 'ACTIVE',
    templateCode: row?.templateCode ?? '',
    thruDate: row?.thruDate ? new Date(row.thruDate) : undefined,
    title: row?.title ?? '',
  }
}

export function AgreementFormDialog() {
  const { t } = useTranslate()
  const currentRow = useAgreementStore((state) => state.currentRow)
  const openDialog = useAgreementStore((state) => state.openDialog)
  const setCurrentRow = useAgreementStore((state) => state.setCurrentRow)
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  const queryClient = useQueryClient()
  const isEdit = openDialog === 'edit'
  const isOpen = isEdit || openDialog === 'create'
  const schema = useMemo(
    () => agreementFormSchema((key) => String(t(key as never))),
    [t]
  )
  const form = useForm<FormInput, unknown, AgreementForm>({
    defaultValues: defaults(),
    resolver: zodResolver(schema),
  })
  const statuses = useMemo(() => getAgreementStatusOptions(t), [t])
  const close = () => {
    setOpenDialog(null)
    setCurrentRow(null)
    form.reset(defaults())
  }
  const mutation = useMutation({
    mutationFn: (values: AgreementForm) =>
      isEdit && currentRow?.id
        ? agreementService.update(currentRow.id, values)
        : agreementService.create(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agreements'] })
      toast.success(
        t(
          isEdit ? 'agreements.messages.updated' : 'agreements.messages.created'
        )
      )
      close()
    },
  })

  useEffect(() => {
    if (isOpen) form.reset(defaults(isEdit ? currentRow : null))
  }, [currentRow, form, isEdit, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={() => !mutation.isPending && close()}>
      <DialogContent presentation='reference' className='sm:max-w-xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {t(isEdit ? 'agreements.dialog.edit' : 'agreements.dialog.create')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex h-full flex-col'
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className='-mr-4 max-h-[60vh] flex-1 overflow-y-auto pr-4'>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <TextField
                    control={form.control}
                    label={t('agreements.dialog.fields.title')}
                    name='title'
                  />
                  <TextField
                    control={form.control}
                    label={t('agreements.dialog.fields.code')}
                    name='code'
                  />
                  {(
                    [
                      'templateCode',
                      'extContractId',
                      'extPolicyId',
                      'extPlanId',
                    ] as const
                  ).map((name) => (
                    <TextField
                      control={form.control}
                      key={name}
                      label={t(`agreements.dialog.fields.${name}`)}
                      name={name}
                    />
                  ))}
                  <FormField
                    control={form.control}
                    name='overrideRatio'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('agreements.dialog.fields.overrideRatio')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            step='any'
                            type='number'
                            value={
                              typeof field.value === 'string' ? field.value : ''
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <TextField
                    control={form.control}
                    label={t('agreements.dialog.fields.extLocation')}
                    name='extLocation'
                  />
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('agreements.dialog.fields.status')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            presentation='reference'
                            clearable
                            clearLabel={t('common.clear')}
                            emptyText={t('common.noResults')}
                            loadingText={t('common.loading')}
                            labelKey='label'
                            onValueChange={(option) =>
                              field.onChange(option?.value)
                            }
                            options={statuses}
                            placeholder={t('form.selectStatus')}
                            value={statuses.find(
                              (option) => option.value === field.value
                            )}
                            valueKey='value'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <DatePickerField
                    clearable={false}
                    className='w-60'
                    control={form.control}
                    label={t('agreements.dialog.fields.fromDate')}
                    name='fromDate'
                  />
                  <DatePickerField
                    clearable={false}
                    className='w-60'
                    control={form.control}
                    label={t('agreements.dialog.fields.thruDate')}
                    name='thruDate'
                  />
                </div>
              </div>
            </div>
            <DialogFooter className='mt-4'>
              <Button
                disabled={mutation.isPending}
                onClick={close}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button
                presentation='reference'
                disabled={mutation.isPending}
                type='submit'
              >
                {isEdit ? t('common.saveChanges') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
