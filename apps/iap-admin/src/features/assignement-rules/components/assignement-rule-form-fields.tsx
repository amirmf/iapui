import { AgreementPolicyIdField } from '@features/assignement-rules/components/agreement-policy-id-field'
import { AssignementRuleDocTypeCodeField } from '@features/assignement-rules/components/assignement-rule-doc-type-code-field'
import type { AssignementRuleForm } from '@features/assignement-rules/model/assignement-rule-form-schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { DatePicker, Input, SingleSelect } from '@iap/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function AssignementRuleFormFields(props: {
  isDialogOpen: boolean
  isEdit: boolean
}) {
  const { isDialogOpen, isEdit } = props
  const { t } = useTranslation()
  const form = useFormContext<AssignementRuleForm>()
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
            <FormLabel>{t('assignementRules.fields.assignee')}</FormLabel>
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
      {numberField('extContractId', t('assignementRules.fields.contractId'))}
      {numberField('extWorkUnitCode', t('assignementRules.fields.workUnit'))}
      {numberField('amountMin', t('assignementRules.fields.amountMin'), true)}
      {numberField('amountMax', t('assignementRules.fields.amountMax'), true)}
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
            <FormLabel>{t('assignementRules.fields.fromDate')}</FormLabel>
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
            <FormLabel>{t('assignementRules.fields.thruDate')}</FormLabel>
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
  )
}
