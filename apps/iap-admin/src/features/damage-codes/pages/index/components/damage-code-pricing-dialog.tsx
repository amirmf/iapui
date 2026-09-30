import { useState } from 'react'

import {
  damageCodePriceTypeColors,
  damageCodePriceTypeTranslationKeys,
  getDamageCodePriceTypeOptions,
} from '@features/damage-codes/constants/damage-code-options'
import { damageCodePricingService } from '@features/damage-codes/services/damage-code-pricing-service'
import { zodResolver } from '@hookform/resolvers/zod'
import type {
  DamageCode,
  DamageCodePricing,
  DamageCodePricingForm,
  PriceType,
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
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  formatDateTime,
} from '@iap/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarDays,
  Ellipsis,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

function pricingDefaults(
  damageCodeId: string | null | undefined,
  pricing?: DamageCodePricing | null
): DamageCodePricingForm {
  return {
    amount: pricing?.amount ?? 0,
    damageCodeId: damageCodeId ?? '',
    fromDate: pricing?.fromDate ? new Date(pricing.fromDate) : undefined,
    priceType: pricing?.priceType ?? 'TOTAL',
    thruDate: pricing?.thruDate ? new Date(pricing.thruDate) : undefined,
    unit: pricing?.unit ?? '',
  }
}

export function DamageCodePricingDialog(props: {
  damageCode: DamageCode
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { damageCode, onOpenChange, open } = props
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [editingPricing, setEditingPricing] =
    useState<DamageCodePricing | null>(null)
  const [showForm, setShowForm] = useState(false)
  const form = useForm<DamageCodePricingForm>({
    defaultValues: pricingDefaults(damageCode.id),
    resolver: zodResolver(damageCodePricingFormSchema),
  })
  const priceTypeOptions = getDamageCodePriceTypeOptions(t)
  const pricingQuery = useQuery({
    enabled: open && Boolean(damageCode.id),
    queryFn: ({ signal }) =>
      damageCodePricingService.getByDamageCodeId(damageCode.id!, {
        signal,
        size: 100,
      }),
    queryKey: ['damage-code-pricing', damageCode.id],
  })
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ['damage-code-pricing', damageCode.id],
    })
  const createMutation = useMutation({
    mutationFn: (values: DamageCodePricingForm) =>
      damageCodePricingService.create({
        ...values,
        damageCodeId: damageCode.id!,
      }),
    onSuccess: () => {
      void invalidate()
      toast.success(t('damageCodes.pricing.messages.created'))
      setShowForm(false)
      form.reset(pricingDefaults(damageCode.id))
    },
  })
  const updateMutation = useMutation({
    mutationFn: (values: DamageCodePricingForm) =>
      damageCodePricingService.update(editingPricing!.id!, {
        ...values,
        damageCodeId: damageCode.id!,
      }),
    onSuccess: () => {
      void invalidate()
      toast.success(t('damageCodes.pricing.messages.updated'))
      setEditingPricing(null)
      setShowForm(false)
      form.reset(pricingDefaults(damageCode.id))
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => damageCodePricingService.delete(id),
    onSuccess: () => {
      void invalidate()
      toast.success(t('damageCodes.pricing.messages.deleted'))
    },
  })
  const softDeleteMutation = useMutation({
    mutationFn: (id: string) => damageCodePricingService.softDelete(id),
    onSuccess: () => {
      void invalidate()
      toast.success(t('damageCodes.pricing.messages.softDeleted'))
    },
  })
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const close = () => {
    onOpenChange(false)
    setEditingPricing(null)
    setShowForm(false)
    form.reset(pricingDefaults(damageCode.id))
  }
  const edit = (pricing: DamageCodePricing) => {
    setEditingPricing(pricing)
    setShowForm(true)
    form.reset(pricingDefaults(damageCode.id, pricing))
  }
  const submit = (values: DamageCodePricingForm) => {
    if (editingPricing) updateMutation.mutate(values)
    else createMutation.mutate(values)
  }

  return (
    <Dialog
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
      open={open}
    >
      <DialogContent className='max-h-[95vh] w-[95vw] sm:max-w-6xl lg:max-w-7xl'>
        <DialogHeader>
          <DialogTitle>{t('damageCodes.pricing.title')}</DialogTitle>
          <DialogDescription>
            {t('damageCodes.dialog.details', {
              code: damageCode.code,
              title: damageCode.title,
            })}
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <PricingList
            isLoading={pricingQuery.isLoading}
            onAdd={() => {
              setEditingPricing(null)
              setShowForm(true)
              form.reset(pricingDefaults(damageCode.id))
            }}
            onDelete={(pricing) => {
              if (
                pricing.id &&
                window.confirm(t('damageCodes.pricing.messages.deleteConfirm'))
              )
                deleteMutation.mutate(pricing.id)
            }}
            onEdit={edit}
            onSoftDelete={(pricing) => {
              if (
                pricing.id &&
                window.confirm(
                  t('damageCodes.pricing.messages.softDeleteConfirm')
                )
              )
                softDeleteMutation.mutate(pricing.id)
            }}
            pricings={pricingQuery.data ?? []}
            showForm={showForm}
          />
          {showForm ? (
            <PricingInlineForm
              form={form}
              isEditing={Boolean(editingPricing)}
              isSubmitting={isSubmitting}
              onCancel={() => {
                setEditingPricing(null)
                setShowForm(false)
                form.reset(pricingDefaults(damageCode.id))
              }}
              onSubmit={submit}
              priceTypeOptions={priceTypeOptions}
            />
          ) : (
            <div className='flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground'>
              <p className='text-center text-sm'>
                {t('damageCodes.pricing.clickToAdd')}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={close} variant='outline'>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PricingList(props: {
  isLoading: boolean
  onAdd: () => void
  onDelete: (pricing: DamageCodePricing) => void
  onEdit: (pricing: DamageCodePricing) => void
  onSoftDelete: (pricing: DamageCodePricing) => void
  pricings: DamageCodePricing[]
  showForm: boolean
}) {
  const {
    isLoading,
    onAdd,
    onDelete,
    onEdit,
    onSoftDelete,
    pricings,
    showForm,
  } = props
  const { t } = useTranslation()
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>
          {t('damageCodes.pricing.current')}
        </h3>
        <Button className='gap-2' disabled={showForm} onClick={onAdd} size='sm'>
          <Plus aria-hidden='true' className='size-4' />
          {t('damageCodes.pricing.addPricing')}
        </Button>
      </div>
      <div className='h-100 space-y-3 overflow-y-auto pe-4'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              className='h-24 animate-pulse rounded-lg bg-muted'
              key={index}
            />
          ))
        ) : pricings.length === 0 ? (
          <div className='flex h-32 flex-col items-center justify-center text-muted-foreground'>
            <p className='mt-2 text-sm'>{t('damageCodes.pricing.noPricing')}</p>
          </div>
        ) : (
          pricings.map((pricing) => (
            <PricingCard
              key={pricing.id}
              onDelete={() => onDelete(pricing)}
              onEdit={() => onEdit(pricing)}
              onSoftDelete={() => onSoftDelete(pricing)}
              pricing={pricing}
            />
          ))
        )}
      </div>
    </div>
  )
}

function PricingCard(props: {
  onDelete: () => void
  onEdit: () => void
  onSoftDelete: () => void
  pricing: DamageCodePricing
}) {
  const { onDelete, onEdit, onSoftDelete, pricing } = props
  const { t } = useTranslation()
  const priceType = pricing.priceType as PriceType
  return (
    <Card className='border'>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <Badge
                className={damageCodePriceTypeColors[priceType]}
                variant='outline'
              >
                {t(damageCodePriceTypeTranslationKeys[priceType] as never)}
              </Badge>
            </div>
            <div className='space-y-1'>
              <div className='text-2xl font-bold text-primary'>
                {pricing.amount.toLocaleString()}
              </div>
              {pricing.fromDate || pricing.thruDate ? (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <CalendarDays aria-hidden='true' className='size-3' />
                  <span>
                    {pricing.fromDate &&
                      formatDateTime(pricing.fromDate, 'PPpp')}
                    {pricing.fromDate && pricing.thruDate && ' - '}
                    {pricing.thruDate &&
                      formatDateTime(pricing.thruDate, 'PPpp')}
                    {pricing.fromDate &&
                      !pricing.thruDate &&
                      ` - ${t('damageCodes.pricing.ongoing')}`}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={t('common.openMenu')}
                className='h-8 w-8 p-0'
                variant='ghost'
              >
                <Ellipsis aria-hidden='true' className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil aria-hidden='true' className='me-2 size-4' />
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSoftDelete}>
                <EyeOff aria-hidden='true' className='me-2 size-4' />
                {t('damageCodes.pricing.softDelete')}
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive' onClick={onDelete}>
                <Trash2 aria-hidden='true' className='me-2 size-4' />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

function PricingInlineForm(props: {
  form: ReturnType<typeof useForm<DamageCodePricingForm>>
  isEditing: boolean
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (values: DamageCodePricingForm) => void
  priceTypeOptions: ReturnType<typeof getDamageCodePriceTypeOptions>
}) {
  const {
    form,
    isEditing,
    isSubmitting,
    onCancel,
    onSubmit,
    priceTypeOptions,
  } = props
  const { t } = useTranslation()
  return (
    <Card className='border-primary/20'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg'>
          {t(
            isEditing
              ? 'damageCodes.pricing.editPricing'
              : 'damageCodes.pricing.addNew'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
                      options={priceTypeOptions}
                      placeholder={t(
                        'damageCodes.pricing.fields.selectPriceType'
                      )}
                      value={priceTypeOptions.find(
                        (option) => option.value === field.value
                      )}
                      valueKey='value'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <TextField
                control={form.control}
                label={t('damageCodes.pricing.fields.amount')}
                name='amount'
                onChange={(event) =>
                  form.setValue('amount', Number(event.target.value))
                }
                placeholder='0.00'
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
            <div className='grid grid-cols-2 gap-4'>
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
            <div className='flex gap-2'>
              <Button className='flex-1' disabled={isSubmitting} type='submit'>
                {isEditing
                  ? t(isSubmitting ? 'form.updating' : 'form.update')
                  : t(
                      isSubmitting
                        ? 'form.creating'
                        : 'damageCodes.pricing.addPricing'
                    )}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={onCancel}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
