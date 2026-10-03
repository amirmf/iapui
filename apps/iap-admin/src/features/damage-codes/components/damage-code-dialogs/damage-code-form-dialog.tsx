import { useEffect, useMemo } from 'react'

import { getDamageCodeStatusOptions } from '@features/damage-codes/constants/damage-code-options'
import { damageCodeService } from '@features/damage-codes/services/damage-code-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type DamageCode,
  type DamageCodeForm,
  damageCodeFormSchema,
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
  TextareaField,
} from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
} from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

function defaults(damageCode?: DamageCode | null): DamageCodeForm {
  return {
    code: damageCode?.code ?? '',
    codeType: damageCode?.codeType ?? '',
    description: damageCode?.description ?? '',
    extCode: damageCode?.extCode ?? '',
    extId: damageCode?.extId ?? '',
    fromDate: damageCode?.fromDate ? new Date(damageCode.fromDate) : new Date(),
    status: damageCode?.status ?? 'ACTIVE',
    thruDate: damageCode?.thruDate ? new Date(damageCode.thruDate) : undefined,
    title: damageCode?.title ?? '',
  }
}

export function DamageCodeFormDialog(props: {
  damageCode?: DamageCode | null
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { damageCode, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const form = useForm<DamageCodeForm>({
    defaultValues: defaults(damageCode),
    resolver: zodResolver(damageCodeFormSchema),
  })
  const statusOptions = useMemo(() => getDamageCodeStatusOptions(t), [t])
  const isEdit = Boolean(damageCode?.id)
  const mutation = useMutation({
    mutationFn: (values: DamageCodeForm) =>
      isEdit && damageCode?.id
        ? damageCodeService.update(damageCode.id, values)
        : damageCodeService.create(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['damage-codes'] })
      toast.success(
        t(
          isEdit
            ? 'damageCodes.messages.updated'
            : 'damageCodes.messages.created'
        )
      )
      onOpenChange(false)
      form.reset()
    },
  })
  useEffect(() => {
    if (open) form.reset(defaults(damageCode))
  }, [damageCode, form, open])
  const close = () => {
    if (mutation.isPending) return
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog onOpenChange={(next) => !next && close()} open={open}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {t(
              isEdit ? 'damageCodes.dialog.edit' : 'damageCodes.dialog.create'
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex h-full flex-col'
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className='-me-4 max-h-[60vh] flex-1 overflow-y-auto pe-4'>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <TextField
                    control={form.control}
                    label={t('damageCodes.dialog.fields.code')}
                    name='code'
                    required
                  />
                  <TextField
                    control={form.control}
                    label={t('damageCodes.dialog.fields.extId')}
                    name='extId'
                  />
                </div>
                <TextField
                  control={form.control}
                  label={t('damageCodes.dialog.fields.title')}
                  name='title'
                  required
                />
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <TextField
                    control={form.control}
                    label={t('damageCodes.dialog.fields.extCode')}
                    name='extCode'
                  />
                  <TextField
                    control={form.control}
                    label={t('damageCodes.dialog.fields.codeType')}
                    name='codeType'
                  />
                </div>
                <TextareaField
                  control={form.control}
                  label={t('damageCodes.dialog.fields.description')}
                  name='description'
                  rows={3}
                />
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>
                        {t('damageCodes.dialog.fields.status')}
                      </FormLabel>
                      <FormControl>
                        <Select
                          labelKey='label'
                          onValueChange={(option) =>
                            field.onChange(option?.value)
                          }
                          options={statusOptions}
                          placeholder={t('damageCodes.dialog.fields.status')}
                          value={statusOptions.find(
                            (option) => option.value === field.value
                          )}
                          valueKey='value'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <DatePickerField
                    className='w-60'
                    control={form.control}
                    label={t('damageCodes.dialog.fields.fromDate')}
                    locale='fa'
                    name='fromDate'
                  />
                  <DatePickerField
                    className='w-60'
                    control={form.control}
                    label={`${t('damageCodes.dialog.fields.thruDate')} (${t('common.optional')})`}
                    locale='fa'
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
              <Button disabled={mutation.isPending} type='submit'>
                {mutation.isPending
                  ? t(isEdit ? 'form.updating' : 'form.creating')
                  : t(isEdit ? 'form.update' : 'form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
