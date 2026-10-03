import { useEffect, useMemo, useState } from 'react'

import { useCoverageDamageCodeApplStore } from '@features/coverage-damage-code-appls/model/coverage-damage-code-appl-store'
import { coverageDamageCodeApplService } from '@features/coverage-damage-code-appls/services/coverage-damage-code-appl-service'
import { coverageService } from '@features/coverages/services/coverage-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type CoverageDamageCodeApplForm,
  type CoverageDamageCodeApplFull,
  coverageDamageCodeApplFormSchema,
  coverageDamageCodeApplStatusSchema,
} from '@iap/api-types'
import {
  DatePickerField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SwitchField,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function getDefaults(
  currentRow?: CoverageDamageCodeApplFull | null
): CoverageDamageCodeApplForm {
  return {
    coverageDetailId: currentRow?.coverageDetailId,
    damageCodeId: currentRow?.damageCodeId,
    description: currentRow?.description,
    device: currentRow?.device,
    fromDate: currentRow?.fromDate ? new Date(currentRow.fromDate) : undefined,
    isRequired: currentRow?.isRequired ?? false,
    priority: currentRow?.priority,
    ratio: currentRow?.ratio,
    ruleDesc: currentRow?.ruleDesc,
    serviceGroup: currentRow?.serviceGroup,
    serviceHeadline: currentRow?.serviceHeadline,
    status: currentRow?.status,
    thruDate: currentRow?.thruDate ? new Date(currentRow.thruDate) : undefined,
  }
}

export function CoverageDamageCodeApplFormDialog() {
  const { t } = useTranslate()
  const currentRow = useCoverageDamageCodeApplStore((state) => state.currentRow)
  const openDialog = useCoverageDamageCodeApplStore((state) => state.openDialog)
  const setCurrentRow = useCoverageDamageCodeApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useCoverageDamageCodeApplStore(
    (state) => state.setOpenDialog
  )
  const queryClient = useQueryClient()
  const isEdit = openDialog === 'edit'
  const isOpen = openDialog === 'create' || isEdit
  const [coverageSearch, setCoverageSearch] = useState('')
  const [damageCodeSearch, setDamageCodeSearch] = useState('')
  const form = useForm<CoverageDamageCodeApplForm>({
    defaultValues: getDefaults(currentRow ?? undefined),
    resolver: zodResolver(coverageDamageCodeApplFormSchema),
  })
  const coveragesQuery = useQuery({
    enabled: isOpen,
    queryFn: ({ signal }) =>
      coverageService.getPage({
        filters: coverageSearch ? { title: coverageSearch } : {},
        page: 0,
        signal,
        size: 20,
      }),
    queryKey: ['coverage-options', coverageSearch],
    staleTime: 30_000,
  })
  const damageCodesQuery = useQuery({
    enabled: isOpen,
    queryFn: ({ signal }) =>
      coverageDamageCodeApplService.getDamageCodeOptions({
        signal,
        title: damageCodeSearch,
      }),
    queryKey: ['damage-code-options', damageCodeSearch],
    staleTime: 30_000,
  })
  const close = () => {
    setOpenDialog(null)
    form.reset()
    setTimeout(() => setCurrentRow(null), 500)
  }
  const createMutation = useMutation({
    mutationFn: coverageDamageCodeApplService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['coverage-damage-code-appls'],
      })
      toast.success(t('coverageDamageCodeAppls.dialog.create'))
      close()
    },
  })
  const updateMutation = useMutation({
    mutationFn: (values: CoverageDamageCodeApplForm) =>
      coverageDamageCodeApplService.update(currentRow!.id!, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['coverage-damage-code-appls'],
      })
      toast.success(t('coverageDamageCodeAppls.dialog.edit'))
      close()
    },
  })
  const isPending = createMutation.isPending || updateMutation.isPending
  useEffect(() => {
    if (isOpen) form.reset(getDefaults(currentRow ?? undefined))
  }, [currentRow, form, isOpen])
  const coverageOptions = useMemo(
    () =>
      (coveragesQuery.data?.content ?? []).flatMap((value) =>
        value.id
          ? [{ label: value.title ?? value.code ?? '', value: value.id }]
          : []
      ),
    [coveragesQuery.data]
  )
  const damageCodeOptions = useMemo(
    () =>
      (damageCodesQuery.data?.content ?? []).flatMap((value) =>
        value.id
          ? [{ label: value.title ?? value.code ?? '', value: value.id }]
          : []
      ),
    [damageCodesQuery.data]
  )
  const statusOptions = useMemo(
    () =>
      coverageDamageCodeApplStatusSchema.options.map((value) => ({
        label: t(
          `coverageDamageCodeAppls.status.${value.toLowerCase()}` as never
        ),
        value,
      })),
    [t]
  )
  const submit = (values: CoverageDamageCodeApplForm) => {
    if (isEdit && currentRow?.id) updateMutation.mutate(values)
    else createMutation.mutate(values)
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && close()}
    >
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('coverageDamageCodeAppls.dialog.edit')
              : t('coverageDamageCodeAppls.dialog.create')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
            <div className='grid gap-4 md:grid-cols-2'>
              <MappingSelectField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.coverage')}
                loading={coveragesQuery.isLoading}
                name='coverageDetailId'
                onSearch={setCoverageSearch}
                options={coverageOptions}
                placeholder={t('coverageDamageCodeAppls.form.selectCoverage')}
              />
              <MappingSelectField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.damageCode')}
                loading={damageCodesQuery.isLoading}
                name='damageCodeId'
                onSearch={setDamageCodeSearch}
                options={damageCodeOptions}
                placeholder={t('coverageDamageCodeAppls.form.selectDamageCode')}
              />
              <NumberField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.priority')}
                name='priority'
              />
              <MappingSelectField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.status')}
                name='status'
                options={statusOptions}
              />
              <NumberField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.ratio')}
                name='ratio'
                step='any'
              />
              <TextField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.device')}
                name='device'
              />
              <TextField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.description')}
                name='description'
              />
              <TextField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.serviceHeadline')}
                name='serviceHeadline'
              />
              <TextField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.serviceGroup')}
                name='serviceGroup'
              />
              <div className='md:col-span-2'>
                <SwitchField
                  control={form.control}
                  label={t('coverageDamageCodeAppls.form.isRequired')}
                  name='isRequired'
                />
              </div>
              <div className='md:col-span-2'>
                <TextField
                  control={form.control}
                  label={t('coverageDamageCodeAppls.form.ruleDesc')}
                  name='ruleDesc'
                />
              </div>
              <DatePickerField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.fromDate')}
                name='fromDate'
              />
              <DatePickerField
                control={form.control}
                label={t('coverageDamageCodeAppls.form.thruDate')}
                name='thruDate'
              />
            </div>
            <DialogFooter>
              <Button
                disabled={isPending}
                onClick={close}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={isPending} type='submit'>
                {isEdit ? t('form.update') : t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function MappingSelectField(props: {
  control: ReturnType<typeof useForm<CoverageDamageCodeApplForm>>['control']
  label: string
  loading?: boolean
  name: 'coverageDetailId' | 'damageCodeId' | 'status'
  onSearch?: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
}) {
  const { control, label, loading, name, onSearch, options, placeholder } =
    props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              isLoading={loading}
              labelKey='label'
              onSearch={onSearch}
              onValueChange={(option) => field.onChange(option?.value)}
              options={options}
              placeholder={placeholder}
              showSearch={Boolean(onSearch)}
              value={options.find((option) => option.value === field.value)}
              valueKey='value'
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function NumberField(props: {
  control: ReturnType<typeof useForm<CoverageDamageCodeApplForm>>['control']
  label: string
  name: 'priority' | 'ratio'
  step?: string
}) {
  const { control, label, name, step } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              onChange={(event) =>
                field.onChange(
                  event.target.value === ''
                    ? undefined
                    : Number(event.target.value)
                )
              }
              step={step}
              type='number'
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
