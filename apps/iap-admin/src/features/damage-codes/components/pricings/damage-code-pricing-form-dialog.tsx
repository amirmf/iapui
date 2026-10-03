import { useEffect, useMemo } from 'react'

import { getDamageCodePricingFormDefaults } from '@features/damage-codes/components/pricings/damage-code-pricing-form-defaults'
import { getDamageCodePriceTypeOptions } from '@features/damage-codes/constants/damage-code-options'
import { damageCodePricingService } from '@features/damage-codes/services/damage-code-pricing-service'
import { zodResolver } from '@hookform/resolvers/zod'
import type {
  DamageCodePricing,
  DamageCodePricingForm,
  DamageCodeSummary,
} from '@iap/api-types'
import { damageCodePricingFormSchema } from '@iap/api-types'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
} from '@iap/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DamageCodePricingFormDialog(props: {
  damageCode: DamageCodeSummary | null
  onOpenChange: (open: boolean) => void
  open: boolean
  pricing?: DamageCodePricing | null
}) {
  const { damageCode, onOpenChange, open, pricing } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const form = useForm<DamageCodePricingForm>({
    defaultValues: getDamageCodePricingFormDefaults(damageCode, pricing),
    resolver: zodResolver(damageCodePricingFormSchema),
  })
  const priceTypes = useMemo(() => getDamageCodePriceTypeOptions(t), [t])
  const isEdit = Boolean(pricing?.id)
  const mutation = useMutation({
    mutationFn: (values: DamageCodePricingForm) =>
      isEdit && pricing?.id
        ? damageCodePricingService.update(pricing.id, values)
        : damageCodePricingService.create(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['damage-code-pricings'] })
      if (damageCode?.id) {
        void queryClient.invalidateQueries({
          queryKey: ['damage-code-pricing', damageCode.id],
        })
      }
      toast.success(
        t(
          isEdit
            ? 'damageCodes.pricing.messages.updated'
            : 'damageCodes.pricing.messages.created'
        )
      )
      onOpenChange(false)
    },
  })
  useEffect(() => {
    if (open) form.reset(getDamageCodePricingFormDefaults(damageCode, pricing))
  }, [damageCode, form, open, pricing])
  const close = () => {
    if (mutation.isPending) return
    onOpenChange(false)
    form.reset(getDamageCodePricingFormDefaults(damageCode))
  }
  return (
    <Dialog onOpenChange={(next) => !next && close()} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {t(
              isEdit
                ? 'damageCodePricings.dialog.edit'
                : 'damageCodePricings.dialog.create'
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              isEdit
                ? 'damageCodePricings.dialog.editDesc'
                : 'damageCodePricings.dialog.createDesc'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className='rounded-md border border-dashed bg-muted/40 px-4 py-3 text-sm'>
          {damageCode?.id ? (
            <span className='font-medium'>
              {damageCode.title
                ? `${damageCode.code ?? damageCode.id} — ${damageCode.title}`
                : (damageCode.code ?? damageCode.id)}
            </span>
          ) : (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Info aria-hidden='true' className='size-4' />
              <span>{t('damageCodePricings.noDamageCodeSelected')}</span>
            </div>
          )}
        </div>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <FormField
              control={form.control}
              name='damageCodeId'
              render={({ field }) => <input type='hidden' {...field} />}
            />
            <FormField
              control={form.control}
              name='priceType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    {t('damageCodes.pricing.fields.priceType')}
                  </FormLabel>
                  <FormControl>
                    <Select
                      labelKey='label'
                      onValueChange={(option) => field.onChange(option?.value)}
                      options={priceTypes}
                      placeholder={t(
                        'damageCodes.pricing.fields.selectPriceType'
                      )}
                      value={priceTypes.find(
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
              <TextField
                control={form.control}
                label={t('damageCodes.pricing.fields.amount')}
                name='amount'
                onChange={(event) =>
                  form.setValue('amount', Number(event.target.value))
                }
                required
                type='number'
              />
              <TextField
                control={form.control}
                label={t('damageCodes.pricing.fields.unit')}
                name='unit'
                placeholder={t('damageCodes.pricing.fields.unitPlaceholder')}
              />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <DatePickerField
                className='w-60'
                control={form.control}
                label={t('damageCodes.pricing.fields.fromDate')}
                locale='fa'
                name='fromDate'
                placeholder={t('damageCodes.pricing.fields.selectFromDate')}
              />
              <DatePickerField
                className='w-60'
                control={form.control}
                label={t('damageCodes.pricing.fields.thruDate')}
                locale='fa'
                name='thruDate'
                placeholder={t('damageCodes.pricing.fields.selectThruDate')}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={mutation.isPending}
                onClick={close}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button
                disabled={mutation.isPending || !damageCode?.id}
                type='submit'
              >
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
