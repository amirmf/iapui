import { useEffect, useMemo, useState } from 'react'

import { AssessmentPromptDocTypeCodeField } from '@features/assessment-prompts/components/assessment-prompt-doc-type-code-field'
import { AssessmentPromptEnumField } from '@features/assessment-prompts/components/assessment-prompt-enum-field'
import {
  getAssessmentPromptPlaceTypeOptions,
  getAssessmentPromptRuleStateOptions,
  getAssessmentPromptStatusOptions,
} from '@features/assessment-prompts/constants/assessment-prompts-constant'
import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { agreementSelectionService } from '@features/assessment-prompts/services/agreement-selection-service'
import { assessmentPromptService } from '@features/assessment-prompts/services/assessment-prompt-service'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type AssessmentPrompt,
  type AssessmentPromptForm,
  assessmentPromptFormSchema,
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
  SearchableSelect,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function defaults(row?: AssessmentPrompt | null): AssessmentPromptForm {
  return {
    agreementId: row?.agreementId ?? undefined,
    docTypeCode: row?.docTypeCode ?? '',
    fromDate: row?.fromDate ? new Date(row.fromDate) : new Date(),
    inputParams: row?.inputParams ?? '',
    methodNames: row?.methodNames ?? '',
    placeType: row?.placeType ?? null,
    prompt: row?.prompt ?? '',
    ruleState: row?.ruleState ?? 'SECONDARY',
    status: row?.status ?? 'ACTIVE',
    thruDate: row?.thruDate ? new Date(row.thruDate) : undefined,
    title: row?.title ?? '',
  }
}

export function AssessmentPromptFormDialog() {
  const { t, i18n } = useTranslate()
  const client = useQueryClient()
  const row = useAssessmentPrompt((state) => state.currentRow)
  const open = useAssessmentPrompt((state) => state.open)
  const setOpen = useAssessmentPrompt((state) => state.setOpen)
  const isEdit = open === 'edit'
  const isOpen = open === 'create' || isEdit
  const [agreementSearch, setAgreementSearch] = useState('')
  const { data: agreements, isFetching: agreementsLoading } = useQuery({
    queryKey: ['agreements', 'search', agreementSearch],
    queryFn: () =>
      agreementSelectionService
        .getPage({ title: agreementSearch })
        .then((response) => response.content),
    staleTime: 30000,
  })
  const { data: selectedAgreement } = useQuery({
    queryKey: ['agreement', row?.agreementId],
    queryFn: () => agreementSelectionService.getById(row?.agreementId ?? ''),
    enabled: !!row?.agreementId,
    staleTime: 30000,
  })
  const agreementOptions = useMemo(() => {
    const options =
      agreements
        ?.map((agreement) => ({
          label: agreement.title ?? agreement.code ?? agreement.id ?? '',
          value: agreement.id ?? '',
        }))
        .filter((option) => option.value) || []
    if (
      selectedAgreement?.id &&
      !options.some((option) => option.value === selectedAgreement.id)
    ) {
      options.push({
        label:
          selectedAgreement.title ??
          selectedAgreement.code ??
          selectedAgreement.id ??
          '',
        value: selectedAgreement.id,
      })
    } else if (
      row?.agreementId &&
      !options.some((option) => option.value === row.agreementId)
    ) {
      options.push({ label: row.agreementId, value: row.agreementId })
    }
    return options
  }, [agreements, selectedAgreement, row])
  const form = useForm<AssessmentPromptForm>({
    defaultValues: defaults(isEdit ? row : null),
    resolver: zodResolver(assessmentPromptFormSchema),
  })
  const resetForm = () => {
    form.reset(defaults(isEdit ? row : null))
    setAgreementSearch('')
  }
  useEffect(() => {
    if (isOpen) {
      form.reset(defaults(isEdit ? row : null))
      setAgreementSearch('')
    }
  }, [form, isEdit, isOpen, row])
  const mutation = useMutation({
    mutationFn: (values: AssessmentPromptForm) =>
      isEdit && row?.id
        ? assessmentPromptService.update(row.id, values)
        : assessmentPromptService.create(values),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['assessment-prompts'] })
      toast.success(
        t(
          isEdit
            ? 'assessmentPrompts.messages.updated'
            : 'assessmentPrompts.messages.created'
        )
      )
      setOpen(null)
      resetForm()
    },
  })
  const status = useMemo(() => getAssessmentPromptStatusOptions(t), [t])
  const ruleState = useMemo(() => getAssessmentPromptRuleStateOptions(t), [t])
  const placeType = useMemo(
    () => [
      { label: t('common.none'), value: '__NONE__' },
      ...getAssessmentPromptPlaceTypeOptions(t),
    ],
    [t]
  )
  const handleClose = () => {
    if (!mutation.isPending) {
      setOpen(null)
      resetForm()
    }
  }

  return (
    <Dialog onOpenChange={(next) => !next && handleClose()} open={isOpen}>
      <DialogContent className='sm:max-w-2xl' presentation='reference'>
        <DialogHeader className='text-left' presentation='reference'>
          <DialogTitle presentation='reference'>
            {t(
              isEdit
                ? 'assessmentPrompts.dialog.edit'
                : 'assessmentPrompts.dialog.create'
            )}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex h-full flex-col'
            noValidate
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className='-mr-4 max-h-[60vh] flex-1 overflow-y-auto pr-4'>
              <div className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <TextField
                    control={form.control}
                    label={t('assessmentPrompts.dialog.fields.title')}
                    name='title'
                  />
                  <FormField
                    control={form.control}
                    name='agreementId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('assessmentPrompts.dialog.fields.agreement')}
                        </FormLabel>
                        <FormControl>
                          <SearchableSelect
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            ref={field.ref}
                            value={field.value}
                            items={agreementOptions}
                            isLoading={agreementsLoading}
                            onSearch={setAgreementSearch}
                            placeholder={t(
                              'assessmentPrompts.dialog.fields.selectAgreement'
                            )}
                            loadingText={t('common.loading')}
                            emptyText={t('common.noResults')}
                            clearText={t('common.clear')}
                            selectText={t('common.select')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                  <AssessmentPromptEnumField
                    label={t('assessmentPrompts.dialog.fields.status')}
                    name='status'
                    options={status}
                  />
                  <AssessmentPromptEnumField
                    label={t('assessmentPrompts.dialog.fields.ruleState')}
                    name='ruleState'
                    options={ruleState}
                  />
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                  <AssessmentPromptEnumField
                    label={t('assessmentPrompts.dialog.fields.placeType')}
                    name='placeType'
                    options={placeType}
                  />
                  <AssessmentPromptDocTypeCodeField enabled={isOpen} />
                </div>
                <TextareaField
                  control={form.control}
                  label={t('assessmentPrompts.dialog.fields.prompt')}
                  name='prompt'
                  presentation='reference'
                  rows={3}
                />
                <TextareaField
                  control={form.control}
                  dir='ltr'
                  label={t('assessmentPrompts.dialog.fields.methodNames')}
                  name='methodNames'
                  presentation='reference'
                  rows={3}
                />
                <TextareaField
                  control={form.control}
                  dir='ltr'
                  label={t('assessmentPrompts.dialog.fields.inputParams')}
                  name='inputParams'
                  presentation='reference'
                  rows={3}
                />
                <div className='grid gap-4 md:grid-cols-2'>
                  <DatePickerField
                    control={form.control}
                    label={t('assessmentPrompts.dialog.fields.fromDate')}
                    locale={i18n.language === 'fa' ? 'fa' : 'en'}
                    calendarClassName='w-[240px]'
                    presentation='reference'
                    showClear={false}
                    name='fromDate'
                  />
                  <DatePickerField
                    control={form.control}
                    label={t('assessmentPrompts.dialog.fields.thruDate')}
                    locale={i18n.language === 'fa' ? 'fa' : 'en'}
                    calendarClassName='w-[240px]'
                    presentation='reference'
                    showClear={false}
                    name='thruDate'
                  />
                </div>
              </div>
            </div>
            <DialogFooter className='mt-4'>
              <Button
                disabled={mutation.isPending}
                onClick={handleClose}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={mutation.isPending} type='submit'>
                {t(isEdit ? 'common.saveChanges' : 'common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
