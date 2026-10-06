import { useEffect, useMemo, useState } from 'react'

import { agreementCoverageApplService } from '@features/agreements/services/agreement-coverage-appl-service'
import { agreementService } from '@features/agreements/services/agreement-service'
import { coverageService } from '@features/coverages'
import { damageCodeService } from '@features/damage-codes'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type AgreementCoverageApplForm,
  type AgreementCoverageApplFull,
  agreementCoverageApplFormSchema,
} from '@iap/api-types'
import {
  DatePickerField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

type SelectOption = { label: string; value: string }
type SelectName =
  'agreementId' | 'coverageDetailId' | 'coverageGroupId' | 'damageCodeId'
type NumberName =
  'overrideRatio' | 'franchisePercentage' | 'coverageAmount' | 'amountPerCase'

function defaults(
  row?: AgreementCoverageApplFull | null,
  agreementId?: string | null
): AgreementCoverageApplForm {
  return {
    agreementId: row?.agreementId ?? agreementId ?? '',
    amountPerCase: row?.amountPerCase ?? undefined,
    coverageAmount: row?.coverageAmount ?? undefined,
    coverageDetailId: row?.coverageDetailId ?? '',
    coverageGroupId: row?.coverageGroupId ?? '',
    damageCodeId: row?.damageCodeId ?? '',
    franchisePercentage: row?.franchisePercentage ?? undefined,
    fromDate: row?.fromDate ? new Date(row.fromDate) : undefined,
    overrideRatio: row?.overrideRatio ?? undefined,
    thruDate: row?.thruDate ? new Date(row.thruDate) : undefined,
  }
}
function options(
  values: readonly {
    id?: string | null
    title?: string | null
    code?: string | number | null
  }[]
): SelectOption[] {
  return values.flatMap((value) =>
    value.id
      ? [
          {
            label:
              `${value.title ?? ''}${value.code ? ` (${value.code})` : ''}`.trim(),
            value: value.id,
          },
        ]
      : []
  )
}

export function AgreementCoverageApplFormDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: AgreementCoverageApplFull | null
  defaultAgreementId?: string | null
}) {
  const {
    open: isOpen,
    onOpenChange,
    currentRow,
    defaultAgreementId: agreementId,
  } = props
  const { t } = useTranslate()
  const queryClient = useQueryClient()
  const isEdit = !!currentRow?.id
  const [agreementSearch, setAgreementSearch] = useState('')
  const [coverageDetailSearch, setCoverageDetailSearch] = useState('')
  const [coverageGroupSearch, setCoverageGroupSearch] = useState('')
  const [damageCodeSearch, setDamageCodeSearch] = useState('')
  const form = useForm<AgreementCoverageApplForm>({
    defaultValues: defaults(currentRow, agreementId),
    resolver: zodResolver(agreementCoverageApplFormSchema),
  })
  const agreementsQuery = useQuery({
    queryFn: () =>
      agreementService.getPage({
        filters: agreementSearch ? { title: agreementSearch } : {},
        page: 0,
        size: 20,
      }),
    queryKey: ['agreement-options', agreementSearch],
  })
  const coverageDetailQuery = useQuery({
    queryFn: () =>
      coverageService.getPage({
        filters: {
          ...(coverageDetailSearch ? { title: coverageDetailSearch } : {}),
          coverageType: 'DETAIL',
        },
        page: 0,
        size: 20,
      }),
    queryKey: ['coverage-options', coverageDetailSearch],
  })
  const coverageGroupQuery = useQuery({
    queryFn: () =>
      coverageService.getPage({
        filters: {
          ...(coverageGroupSearch ? { title: coverageGroupSearch } : {}),
          coverageType: 'GROUP',
        },
        page: 0,
        size: 20,
      }),
    queryKey: ['coverage-group-options', coverageGroupSearch],
  })
  const damageCodeQuery = useQuery({
    queryFn: ({ signal }) =>
      damageCodeService.getPage({
        filters: damageCodeSearch ? { title: damageCodeSearch } : {},
        page: 0,
        signal,
        size: 20,
      }),
    queryKey: damageCodeSearch
      ? ['damage-code-options', damageCodeSearch]
      : ['damage-code-options'],
    staleTime: 30_000,
    gcTime: 30_000,
  })
  const close = () => {
    onOpenChange(false)
    form.reset(defaults(undefined, agreementId))
  }
  const createMutation = useMutation({
    mutationFn: agreementCoverageApplService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['agreement-coverage-appls'],
      })
      close()
    },
  })
  const updateMutation = useMutation({
    mutationFn: (values: AgreementCoverageApplForm) =>
      agreementCoverageApplService.update(currentRow!.id!, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['agreement-coverage-appls'],
      })
      onOpenChange(false)
    },
  })
  const pending = createMutation.isPending || updateMutation.isPending
  useEffect(() => {
    if (isOpen) form.reset(defaults(currentRow, agreementId))
  }, [agreementId, currentRow, form, isOpen])
  const agreementOptions = useMemo(
    () => options(agreementsQuery.data?.content ?? []),
    [agreementsQuery.data]
  )
  const coverageDetailOptions = useMemo(
    () => options(coverageDetailQuery.data?.content ?? []),
    [coverageDetailQuery.data]
  )
  const coverageGroupOptions = useMemo(
    () => options(coverageGroupQuery.data?.content ?? []),
    [coverageGroupQuery.data]
  )
  const damageCodeOptions = useMemo(
    () => options(damageCodeQuery.data?.content ?? []),
    [damageCodeQuery.data]
  )
  const submit = (values: AgreementCoverageApplForm) => {
    const payload: AgreementCoverageApplForm = {
      ...values,
      overrideRatio:
        values.overrideRatio == null ? undefined : Number(values.overrideRatio),
      franchisePercentage:
        values.franchisePercentage == null
          ? undefined
          : Number(values.franchisePercentage),
      coverageAmount:
        values.coverageAmount == null
          ? undefined
          : Number(values.coverageAmount),
      amountPerCase:
        values.amountPerCase == null ? undefined : Number(values.amountPerCase),
    }
    if (isEdit && currentRow?.id) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !pending && close()}>
      <DialogContent presentation='reference' className='sm:max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('agreementCoverageAppls.dialog.edit' as never)
              : t('agreementCoverageAppls.dialog.create' as never)}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('agreementCoverageAppls.dialog.editDesc' as never)
              : t('agreementCoverageAppls.dialog.createDesc' as never)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
            <MappingSelect
              control={form.control}
              label={t('agreementCoverageAppls.form.agreement' as never)}
              loading={agreementsQuery.isFetching}
              name='agreementId'
              onSearch={setAgreementSearch}
              options={agreementOptions}
              placeholder={t(
                'agreementCoverageAppls.form.selectAgreement' as never
              )}
            />
            <MappingSelect
              control={form.control}
              label={t('agreementCoverageAppls.form.coverageDetail' as never)}
              loading={coverageDetailQuery.isFetching}
              name='coverageDetailId'
              onSearch={setCoverageDetailSearch}
              options={coverageDetailOptions}
              placeholder={t(
                'agreementCoverageAppls.form.selectCoverageDetail' as never
              )}
            />
            <MappingSelect
              control={form.control}
              label={t('agreementCoverageAppls.form.coverageGroup' as never)}
              loading={coverageGroupQuery.isFetching}
              name='coverageGroupId'
              onSearch={setCoverageGroupSearch}
              options={coverageGroupOptions}
              placeholder={t(
                'agreementCoverageAppls.form.selectCoverageGroup' as never
              )}
            />
            <MappingSelect
              control={form.control}
              label={t('agreementCoverageAppls.form.damageCode' as never)}
              loading={damageCodeQuery.isFetching}
              name='damageCodeId'
              onSearch={setDamageCodeSearch}
              options={damageCodeOptions}
              placeholder={t(
                'agreementCoverageAppls.form.selectDamageCode' as never
              )}
            />
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {(
                [
                  'overrideRatio',
                  'franchisePercentage',
                  'coverageAmount',
                  'amountPerCase',
                ] as const
              ).map((name) => (
                <NumberField
                  key={name}
                  control={form.control}
                  label={t(`agreementCoverageAppls.form.${name}` as never)}
                  name={name}
                />
              ))}
              <DatePickerField
                clearable={false}
                control={form.control}
                label={t('agreementCoverageAppls.form.fromDate' as never)}
                placeholder={t('agreementCoverageAppls.form.fromDate' as never)}
                name='fromDate'
              />
              <DatePickerField
                clearable={false}
                control={form.control}
                label={t('agreementCoverageAppls.form.thruDate' as never)}
                placeholder={t('agreementCoverageAppls.form.thruDate' as never)}
                name='thruDate'
              />
            </div>
            <DialogFooter>
              <Button presentation='reference' disabled={pending} type='submit'>
                {isEdit ? t('common.update' as never) : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function MappingSelect(props: {
  control: ReturnType<typeof useForm<AgreementCoverageApplForm>>['control']
  label: string
  loading?: boolean
  name: SelectName
  onSearch: (value: string) => void
  options: SelectOption[]
  placeholder: string
}) {
  const {
    control,
    label,
    loading,
    name,
    onSearch,
    options: selectOptions,
    placeholder,
  } = props
  const { t } = useTranslate()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              presentation='reference'
              selectedValue={field.value ?? undefined}
              clearable
              clearLabel={t('common.clear')}
              emptyText={t('common.noResults' as never)}
              loadingText={t('common.loading')}
              searchPlaceholder={placeholder}
              isLoading={loading}
              labelKey='label'
              onSearch={onSearch}
              onValueChange={(option) => field.onChange(option?.value ?? '')}
              options={selectOptions}
              placeholder={placeholder}
              showSearch
              value={selectOptions.find(
                (option) => option.value === field.value
              )}
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
  control: ReturnType<typeof useForm<AgreementCoverageApplForm>>['control']
  label: string
  name: NumberName
}) {
  const { control, label, name } = props
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
              step='any'
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
