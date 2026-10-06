import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import type { AssignementRule, AssignementRuleRequest } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import {
  Button,
  DatePicker,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  SingleSelect,
} from '@iap/ui'
import { type QueryObserverResult, useMutation } from '@tanstack/react-query'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useAssignementRule } from '../context/assignement-rule-context'
import {
  type AssignementRuleForm,
  assignementRuleFormSchema,
} from '../data/assignement-rule-schema'
import assignementRuleService from '../services/assignement-rule-service'
import { AgreementPolicyIdField } from './agreement-policy-id-field'
import { AssignementRuleDocTypeCodeField } from './assignement-rule-doc-type-code-field'

const emptyValues: AssignementRuleForm = {
  status: 'ACTIVE',
  title: '',
}

function toOptionalNumber(value: string | undefined): number | undefined {
  return value === undefined || value === '' ? undefined : Number(value)
}

function toRequestData(data: AssignementRuleForm): AssignementRuleRequest {
  return {
    ...data,
    amountApprovedMax: toOptionalNumber(data.amountApprovedMax),
    amountApprovedMin: toOptionalNumber(data.amountApprovedMin),
    amountMax: toOptionalNumber(data.amountMax),
    amountMin: toOptionalNumber(data.amountMin),
    extContractId: toOptionalNumber(data.extContractId),
    extPolicyId: toOptionalNumber(data.extPolicyId),
    extWorkUnitCode: toOptionalNumber(data.extWorkUnitCode),
  }
}

function toFormValues(rule?: AssignementRule | null): AssignementRuleForm {
  if (!rule) return emptyValues
  return {
    amountApprovedMax: rule.amountApprovedMax?.toString() ?? '',
    amountApprovedMin: rule.amountApprovedMin?.toString() ?? '',
    amountMax: rule.amountMax?.toString() ?? '',
    amountMin: rule.amountMin?.toString() ?? '',
    docTypeCode: rule.docTypeCode ?? '',
    extContractId: rule.extContractId?.toString() ?? '',
    extPolicyId: rule.extPolicyId?.toString() ?? '',
    extWorkUnitCode: rule.extWorkUnitCode?.toString() ?? '',
    fromDate: rule.fromDate ? new Date(rule.fromDate) : undefined,
    mainAssignedUserUsername: rule.mainAssignedUserUsername ?? '',
    status: rule.status ?? 'ACTIVE',
    thruDate: rule.thruDate ? new Date(rule.thruDate) : undefined,
    title: rule.title ?? '',
  }
}

export function AssignementRuleFormDialog<TData>(props: {
  refetch: () => Promise<QueryObserverResult<TData>> | Promise<unknown> | void
}) {
  const { refetch } = props
  const { t } = useTranslation()
  const open = useAssignementRule((state) => state.open)
  const currentRule = useAssignementRule((state) => state.currentRow)
  const setOpen = useAssignementRule((state) => state.setOpen)
  const setCurrentRow = useAssignementRule((state) => state.setCurrentRow)

  const isEdit = Boolean(currentRule?.id)
  const isDialogOpen = open === 'create' || open === 'edit'

  const form = useForm<AssignementRuleForm>({
    defaultValues: toFormValues(currentRule),
    resolver: zodResolver(assignementRuleFormSchema(t)),
  })

  useEffect(() => {
    if (isDialogOpen) form.reset(toFormValues(currentRule))
  }, [currentRule, form, isDialogOpen])

  const handleClose = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const createMutation = useMutation({
    mutationFn: assignementRuleService.create,
    onError: () => toast.error(t('assignementRules.messages.createFailed')),
    onSuccess: async () => {
      await refetch()
      toast.success(t('assignementRules.messages.created'))
      handleClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ data, id }: { data: AssignementRuleRequest; id: string }) =>
      assignementRuleService.update(id, data),
    onError: () => toast.error(t('assignementRules.messages.updateFailed')),
    onSuccess: async () => {
      await refetch()
      toast.success(t('assignementRules.messages.updated'))
      handleClose()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  const submit: SubmitHandler<AssignementRuleForm> = (data) => {
    if (isEdit && currentRule?.id) {
      updateMutation.mutate({ data: toRequestData(data), id: currentRule.id })
    } else {
      createMutation.mutate(toRequestData(data))
    }
  }

  const numberField = (
    name:
      | 'extPolicyId'
      | 'extContractId'
      | 'extWorkUnitCode'
      | 'amountMin'
      | 'amountMax'
      | 'amountApprovedMin'
      | 'amountApprovedMax',
    label: string,
    numberWithComma = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              numberWithComma={numberWithComma}
              numerical={!numberWithComma}
              onChange={(event) => field.onChange(event.target.value)}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog
      onOpenChange={(nextOpen) => !isPending && !nextOpen && handleClose()}
      open={isDialogOpen}
    >
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t(
              isEdit
                ? 'assignementRules.dialog.edit'
                : 'assignementRules.dialog.create'
            )}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('assignementRules.fields.title')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AssignementRuleDocTypeCodeField enabled={isDialogOpen} />
              <AgreementPolicyIdField
                control={form.control}
                enabled={isDialogOpen}
                isEdit={isEdit}
                label={t('assignementRules.fields.policyId')}
                name='extPolicyId'
                placeholder={t('assignementRules.fields.policyId')}
              />
              <FormField
                control={form.control}
                name='mainAssignedUserUsername'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('assignementRules.fields.assignee')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('assignementRules.fields.status')}</FormLabel>
                    <SingleSelect
                      className='w-full'
                      items={[
                        {
                          label: t('assignementRules.status.active'),
                          value: 'ACTIVE',
                        },
                        {
                          label: t('assignementRules.status.inactive'),
                          value: 'INACTIVE',
                        },
                      ]}
                      onChange={field.onChange}
                      value={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {numberField(
                'extContractId',
                t('assignementRules.fields.contractId')
              )}
              {numberField(
                'extWorkUnitCode',
                t('assignementRules.fields.workUnit')
              )}
              {numberField(
                'amountMin',
                t('assignementRules.fields.amountMin'),
                true
              )}
              {numberField(
                'amountMax',
                t('assignementRules.fields.amountMax'),
                true
              )}
              {numberField(
                'amountApprovedMin',
                t('assignementRules.fields.amountApprovedMin'),
                true
              )}
              {numberField(
                'amountApprovedMax',
                t('assignementRules.fields.amountApprovedMax'),
                true
              )}
              <FormField
                control={form.control}
                name='fromDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('assignementRules.fields.fromDate')}
                    </FormLabel>
                    <DatePicker
                      clearable
                      onChange={(date) => field.onChange(date ?? undefined)}
                      placeholder={t('assignementRules.fields.fromDate')}
                      presentation='reference'
                      value={field.value ?? undefined}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='thruDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('assignementRules.fields.thruDate')}
                    </FormLabel>
                    <DatePicker
                      clearable
                      onChange={(date) => field.onChange(date ?? undefined)}
                      placeholder={t('assignementRules.fields.thruDate')}
                      presentation='reference'
                      value={field.value ?? undefined}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={isPending}
                onClick={handleClose}
                type='button'
                variant='outline'
              >
                {t('common.cancel')}
              </Button>
              <Button disabled={isPending} type='submit'>
                {t(isEdit ? 'common.save' : 'common.create')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
