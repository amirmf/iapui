import { useEffect, useMemo, useState } from 'react'

import { useCoverageStore } from '@features/coverages/context/store/coverage-store'
import { coverageService } from '@features/coverages/services/coverage-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type Coverage,
  type CoverageForm,
  coverageFormSchema,
  coverageStatusSchema,
  coverageTypeSchema,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function getDefaults(currentRow?: Coverage): CoverageForm {
  return {
    code: currentRow?.code ?? '',
    coverageType: currentRow?.coverageType ?? 'GROUP',
    fromDate: currentRow?.fromDate ? new Date(currentRow.fromDate) : new Date(),
    maximumCoverage: currentRow?.maximumCoverage ?? undefined,
    rootCoverageId: currentRow?.rootCoverageId ?? undefined,
    status: currentRow?.status ?? 'ACTIVE',
    thruDate: currentRow?.thruDate ? new Date(currentRow.thruDate) : undefined,
    title: currentRow?.title ?? '',
    typeIndicator: currentRow?.typeIndicator ?? '',
  }
}

export function CoverageFormDialog() {
  const { t } = useTranslate()
  const currentRow = useCoverageStore((state) => state.currentRow)
  const openDialog = useCoverageStore((state) => state.openDialog)
  const setCurrentRow = useCoverageStore((state) => state.setCurrentRow)
  const setOpenDialog = useCoverageStore((state) => state.setOpenDialog)
  const queryClient = useQueryClient()
  const isEdit = openDialog === 'edit'
  const isOpen = openDialog === 'create' || isEdit
  const [groupSearch, setGroupSearch] = useState('')
  const form = useForm<CoverageForm>({
    defaultValues: getDefaults(currentRow ?? undefined),
    resolver: zodResolver(coverageFormSchema),
  })
  const groupsQuery = useQuery({
    enabled: isOpen,
    queryFn: ({ signal }) =>
      coverageService.getPageFull({
        filters: {
          coverageType: 'GROUP',
          ...(groupSearch ? { title: groupSearch } : {}),
        },
        signal,
        size: 20,
      }),
    queryKey: ['coverage-groups', groupSearch],
    staleTime: 30_000,
  })
  const createMutation = useMutation({
    mutationFn: coverageService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['coverages'] })
      toast.success(t('coverages.messages.created' as never))
      close()
    },
  })
  const updateMutation = useMutation({
    mutationFn: (value: CoverageForm) =>
      coverageService.update(currentRow!.id!, value),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['coverages'] })
      toast.success(t('coverages.messages.updated' as never))
      close()
    },
  })
  const isPending = createMutation.isPending || updateMutation.isPending
  const coverageTypeOptions = useMemo(
    () =>
      coverageTypeSchema.options.map((value) => ({
        label: String(t(`coverages.type.${value.toLowerCase()}` as never)),
        value,
      })),
    [t]
  )
  const statusOptions = useMemo(
    () =>
      coverageStatusSchema.options.map((value) => ({
        label: String(t(`coverages.status.${value.toLowerCase()}` as never)),
        value,
      })),
    [t]
  )
  const rootCoverageOptions = useMemo(() => {
    const options = (groupsQuery.data?.content ?? [])
      .filter((coverage) => coverage.id)
      .map((coverage) => ({
        label: coverage.title ?? coverage.code ?? '',
        value: coverage.id!,
      }))
    if (
      currentRow?.rootCoverageId &&
      currentRow.rootCoverage &&
      !options.some((option) => option.value === currentRow.rootCoverageId)
    ) {
      options.push({
        label:
          currentRow.rootCoverage.title ?? currentRow.rootCoverage.code ?? '',
        value: currentRow.rootCoverageId,
      })
    }
    return options
  }, [currentRow, groupsQuery.data])
  useEffect(() => {
    if (isOpen) form.reset(getDefaults(currentRow ?? undefined))
  }, [currentRow, form, isOpen])
  function close() {
    if (!isPending) {
      setOpenDialog(null)
      form.reset()
      setTimeout(() => setCurrentRow(null), 500)
    }
  }
  function submit(values: CoverageForm) {
    if (isEdit && currentRow?.id) updateMutation.mutate(values)
    else createMutation.mutate(values)
  }
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? t('coverages.dialog.edit') : t('coverages.dialog.create')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex h-full flex-col'
            onSubmit={form.handleSubmit(submit)}
          >
            <div className='-mr-4 max-h-[60vh] flex-1 overflow-y-auto pr-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <TextField
                  control={form.control}
                  label={t('coverages.dialog.fields.title')}
                  name='title'
                  required
                />
                <TextField
                  control={form.control}
                  label={t('coverages.dialog.fields.code')}
                  name='code'
                  required
                />
                <CoverageSelectField
                  control={form.control}
                  label={t('coverages.dialog.fields.type')}
                  name='coverageType'
                  options={coverageTypeOptions}
                />
                <TextField
                  control={form.control}
                  label={t('coverages.dialog.fields.typeIndicator')}
                  name='typeIndicator'
                  required
                />
                <FormField
                  control={form.control}
                  name='maximumCoverage'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('coverages.dialog.fields.maxCoverage')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          min={0}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === ''
                                ? undefined
                                : Number(event.target.value)
                            )
                          }
                          type='number'
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CoverageSelectField
                  control={form.control}
                  label={t('coverages.dialog.fields.status')}
                  name='status'
                  options={statusOptions}
                />
                <CoverageSelectField
                  clearable
                  control={form.control}
                  label={t('coverages.dialog.fields.rootCoverageId')}
                  loading={groupsQuery.isFetching}
                  name='rootCoverageId'
                  onSearch={setGroupSearch}
                  options={rootCoverageOptions}
                  search
                />
                <DatePickerField
                  control={form.control}
                  label={t('coverages.dialog.fields.fromDate')}
                  name='fromDate'
                  required
                />
                <DatePickerField
                  control={form.control}
                  label={`${t('coverages.dialog.fields.thruDate')} (${t('common.optional')})`}
                  name='thruDate'
                />
              </div>
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
                {isPending
                  ? isEdit
                    ? t('form.updating')
                    : t('form.creating')
                  : isEdit
                    ? t('form.update')
                    : t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function CoverageSelectField(props: {
  clearable?: boolean
  control: ReturnType<typeof useForm<CoverageForm>>['control']
  label: string
  loading?: boolean
  name: 'coverageType' | 'status' | 'rootCoverageId'
  onSearch?: (value: string) => void
  options: { label: string; value: string }[]
  search?: boolean
}) {
  const {
    clearable,
    control,
    label,
    loading,
    name,
    onSearch,
    options,
    search,
  } = props
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              clearable={clearable}
              isLoading={loading}
              labelKey='label'
              onSearch={onSearch}
              onValueChange={(option) => field.onChange(option?.value)}
              options={options}
              showSearch={search}
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
