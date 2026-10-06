import { useCallback, useEffect, useMemo } from 'react'

import {
  type AiAssessmentRule,
  type AiAssessmentRuleDefinitionType,
  type AiAssessmentRuleForm as AiAssessmentRuleFormValues,
  type CreateAiAssessmentRuleRequest,
  aiAssessmentRuleDefinitionTypeSchema,
  aiAssessmentRuleFormSchema,
} from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button, SingleSelect, Textarea } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import {
  getAiAssessmentRuleDefinitionTypeOptions,
  getAiAssessmentRuleModelOptions,
  getAiAssessmentRuleStateOptions,
  getAiAssessmentRuleStatusOptions,
} from '../../constants/ai-assessment-rule-constant'
import {
  useCreateAiAssessmentRuleMutation,
  useUpdateAiAssessmentRuleMutation,
} from '../../queries/use-ai-assessment-rules'
import { typedZodResolver } from '../../utils/typed-zod-resolver'
import { AiAssessmentRuleJsonEditor } from '../ai-assessment-rule-json-editor'
import {
  formatJsonText,
  minifyJsonText,
} from '../ai-assessment-rule-json-editor-utils'
import {
  AgreementField,
  type AgreementFieldValueType,
} from './ai-assessment-rule-agreement-field'
import { AiAssessmentRuleDocTypesField } from './ai-assessment-rule-doc-types-field'

const defaults: AiAssessmentRuleFormValues = {
  agreementTemplateCode: '',
  aiModel: 'KAVAN_TEXT_SMALL',
  definitionType: 'GENERAL',
  docTypes: [],
  extContractId: '',
  extPolicyId: '',
  inputParams: '{}',
  methodNames: '',
  ruleState: 'INFORMATION',
  status: 'ACTIVE',
}

const agreementFieldNames = [
  'agreementTemplateCode',
  'extContractId',
  'extPolicyId',
] as const

const agreementFieldByDefinitionType: Partial<
  Record<AiAssessmentRuleDefinitionType, AgreementFieldValueType>
> = {
  AGREEMENT_TEMPLATE: 'templateCode',
  CONTRACT: 'extContractId',
  POLICY: 'extPolicyId',
}

const formFieldByAgreementValueType: Record<
  AgreementFieldValueType,
  (typeof agreementFieldNames)[number]
> = {
  extContractId: 'extContractId',
  extPolicyId: 'extPolicyId',
  templateCode: 'agreementTemplateCode',
}

function toFormValues(rule?: AiAssessmentRule): AiAssessmentRuleFormValues {
  const definitionType = rule?.definitionType ?? defaults.definitionType
  const selectedValueType = agreementFieldByDefinitionType[definitionType]
  const selectedFieldName = selectedValueType
    ? formFieldByAgreementValueType[selectedValueType]
    : undefined
  const agreementValues = {
    agreementTemplateCode: '',
    extContractId: '',
    extPolicyId: '',
  }

  if (selectedFieldName === 'agreementTemplateCode') {
    agreementValues.agreementTemplateCode = rule?.agreementTemplateCode ?? ''
  }
  if (selectedFieldName === 'extContractId') {
    agreementValues.extContractId = rule?.extContractId?.toString() ?? ''
  }
  if (selectedFieldName === 'extPolicyId') {
    agreementValues.extPolicyId = rule?.extPolicyId?.toString() ?? ''
  }

  return {
    aiModel: rule?.aiModel ?? defaults.aiModel,
    definitionType,
    docTypes: rule?.docTypes ?? defaults.docTypes,
    id: rule?.id ?? undefined,
    inputParams: formatJsonText(rule?.inputParams || defaults.inputParams),
    methodNames: rule?.methodNames ?? defaults.methodNames,
    ruleState: rule?.ruleState ?? defaults.ruleState,
    skipRule: rule?.skipRule ?? undefined,
    status: rule?.status ?? defaults.status,
    thruDate: rule?.thruDate ?? undefined,
    ...agreementValues,
  }
}

function toOptionalNumber(value: string | undefined): number | undefined {
  return value === undefined || value === '' ? undefined : Number(value)
}

function toOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed || undefined
}

function toRequestData(
  data: AiAssessmentRuleFormValues
): CreateAiAssessmentRuleRequest {
  const selectedValueType = agreementFieldByDefinitionType[data.definitionType]

  return {
    ...data,
    agreementTemplateCode:
      selectedValueType === 'templateCode'
        ? toOptionalText(data.agreementTemplateCode)
        : undefined,
    extContractId:
      selectedValueType === 'extContractId'
        ? toOptionalNumber(data.extContractId)
        : undefined,
    extPolicyId:
      selectedValueType === 'extPolicyId'
        ? toOptionalNumber(data.extPolicyId)
        : undefined,
    inputParams: minifyJsonText(data.inputParams),
  }
}

function isDefinitionType(
  value: string | undefined
): value is AiAssessmentRuleDefinitionType {
  return aiAssessmentRuleDefinitionTypeSchema.safeParse(value).success
}

export function AiAssessmentRuleForm({
  onCancel,
  onPendingChange,
  onSuccess,
  rule,
}: {
  onCancel: () => void
  onPendingChange?: (isPending: boolean) => void
  onSuccess: () => void
  rule?: AiAssessmentRule
}) {
  const { t } = useTranslate()
  const form = useForm<AiAssessmentRuleFormValues>({
    defaultValues: toFormValues(rule),
    resolver: typedZodResolver(aiAssessmentRuleFormSchema(t)),
  })
  const definitionType = useWatch({
    control: form.control,
    name: 'definitionType',
  })
  const agreementValueType = agreementFieldByDefinitionType[definitionType]
  const agreementFieldName = agreementValueType
    ? formFieldByAgreementValueType[agreementValueType]
    : undefined

  const onMutationSuccess = useCallback(() => {
    toast.success(
      t(
        rule?.id
          ? 'aiAssessmentRules.messages.updated'
          : 'aiAssessmentRules.messages.created'
      )
    )
    onSuccess()
  }, [onSuccess, rule?.id, t])

  const create = useCreateAiAssessmentRuleMutation({
    onSuccess: onMutationSuccess,
  })
  const update = useUpdateAiAssessmentRuleMutation({
    onSuccess: onMutationSuccess,
  })

  const enumOptions = useMemo(
    () => ({
      definitionType: getAiAssessmentRuleDefinitionTypeOptions(t),
      model: getAiAssessmentRuleModelOptions(t),
      ruleState: getAiAssessmentRuleStateOptions(t),
      status: getAiAssessmentRuleStatusOptions(t),
    }),
    [t]
  )

  useEffect(() => {
    form.reset(toFormValues(rule))
  }, [form, rule])

  const pending = create.isPending || update.isPending
  useEffect(() => onPendingChange?.(pending), [onPendingChange, pending])

  const submit = (data: AiAssessmentRuleFormValues) => {
    const payload = toRequestData(data)

    if (rule?.id) {
      update.mutate({ data: { ...payload, id: rule.id }, id: rule.id })
      return
    }

    create.mutate(payload)
  }

  const handleDefinitionTypeChange = (
    nextDefinitionType: string | undefined
  ) => {
    if (!isDefinitionType(nextDefinitionType)) return

    form.setValue('definitionType', nextDefinitionType, { shouldDirty: true })
    agreementFieldNames.forEach((fieldName) =>
      form.setValue(fieldName, '', { shouldDirty: true })
    )
    form.clearErrors(agreementFieldNames)
  }

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(submit)}>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='definitionType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('aiAssessmentRules.fields.definitionType')}
                </FormLabel>
                <FormControl>
                  <SingleSelect
                    canClear={false}
                    items={enumOptions.definitionType}
                    onChange={handleDefinitionTypeChange}
                    selectText={t('common.select')}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='ruleState'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('aiAssessmentRules.fields.ruleState')}</FormLabel>
                <FormControl>
                  <SingleSelect
                    canClear={false}
                    items={enumOptions.ruleState}
                    onChange={field.onChange}
                    selectText={t('common.select')}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {agreementValueType && agreementFieldName ? (
          <AgreementField
            control={form.control}
            isEdit={Boolean(rule?.id)}
            label={t(`aiAssessmentRules.fields.${agreementFieldName}`)}
            name={agreementFieldName}
            placeholder={t(
              `aiAssessmentRules.placeholder.${agreementFieldName}` as never
            )}
            valueType={agreementValueType}
          />
        ) : null}
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('aiAssessmentRules.fields.status')}</FormLabel>
                <FormControl>
                  <SingleSelect
                    canClear={false}
                    items={enumOptions.status}
                    onChange={field.onChange}
                    selectText={t('common.select')}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='aiModel'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('aiAssessmentRules.fields.aiModel')}</FormLabel>
                <FormControl>
                  <SingleSelect
                    canClear={false}
                    items={enumOptions.model}
                    onChange={field.onChange}
                    selectText={t('common.select')}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <AiAssessmentRuleDocTypesField control={form.control} />
        <FormField
          control={form.control}
          name='methodNames'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('aiAssessmentRules.fields.methodNames')}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='inputParams'
          render={({ field }) => (
            <FormItem>
              <FormLabel onClick={() => form.setFocus('inputParams')}>
                {t('aiAssessmentRules.fields.inputParams')}
              </FormLabel>
              <FormControl>
                <AiAssessmentRuleJsonEditor
                  ariaLabel={t('aiAssessmentRules.fields.inputParams')}
                  onChange={field.onChange}
                  onErrorChange={(message) => {
                    if (message) {
                      form.setError('inputParams', {
                        message,
                        type: 'validate',
                      })
                      return
                    }

                    form.clearErrors('inputParams')
                  }}
                  ref={field.ref}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            disabled={pending}
            onClick={onCancel}
            type='button'
            variant='outline'
          >
            {t('common.cancel')}
          </Button>
          <Button disabled={pending} type='submit'>
            {pending ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
