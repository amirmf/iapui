import { useEffect } from 'react'

import {
  type AiAssessmentRuleDetail,
  type AiAssessmentRuleDetailForm as AiAssessmentRuleDetailFormValues,
  aiAssessmentRuleDetailFormSchema,
} from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button, Input, Textarea } from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types'
import { useTranslate } from '@shared/i18n/i18n'
import { useForm } from 'react-hook-form'

import { typedZodResolver } from '../../utils/typed-zod-resolver'
import { AiAssessmentRuleJsonEditor } from '../ai-assessment-rule-json-editor'
import {
  formatJsonText,
  minifyJsonText,
} from '../ai-assessment-rule-json-editor-utils'
import { AiAssessmentRuleDetailDocTypeField } from './ai-assessment-rule-detail-doc-type-field'

interface AiAssessmentRuleDetailFormProps {
  detail?: AiAssessmentRuleDetail
  isPending: boolean
  onCancel: () => void
  onSubmit: (detail: AiAssessmentRuleDetail) => void
}

function toFormValues(
  detail?: AiAssessmentRuleDetail
): AiAssessmentRuleDetailFormValues {
  return {
    docTypeCode: detail?.docType?.docTypeCode ?? '',
    inputParams: formatJsonText(detail?.inputParams || '{}'),
    maxThreshold: detail?.maxThreshold?.toString() ?? '',
    methodNames: detail?.methodNames ?? '',
    minThreshold: detail?.minThreshold?.toString() ?? '',
    prompt: detail?.prompt ?? '',
  }
}

function toNullableText(value: string): string | null {
  const trimmed = value.trim()
  return trimmed || null
}

function toOptionalNumber(value: string): number | undefined {
  return value === '' ? undefined : Number(value)
}

export function AiAssessmentRuleDetailForm({
  detail,
  isPending,
  onCancel,
  onSubmit,
}: AiAssessmentRuleDetailFormProps) {
  const { t } = useTranslate()
  const { data, isLoading, options } = useDocTypesData.optionsCode()
  const form = useForm<AiAssessmentRuleDetailFormValues>({
    defaultValues: toFormValues(detail),
    resolver: typedZodResolver(aiAssessmentRuleDetailFormSchema(t)),
  })

  useEffect(() => {
    form.reset(toFormValues(detail))
  }, [detail, form])

  const submit = (values: AiAssessmentRuleDetailFormValues) => {
    const docType = data?.find(
      (item) => item.docTypeCode === values.docTypeCode
    )

    onSubmit({
      docType:
        docType ??
        (detail?.docType?.docTypeCode === values.docTypeCode
          ? detail.docType
          : null),
      id: detail?.id,
      inputParams: minifyJsonText(values.inputParams || '{}'),
      maxThreshold: toOptionalNumber(values.maxThreshold),
      methodNames: toNullableText(values.methodNames),
      minThreshold: toOptionalNumber(values.minThreshold),
      prompt: toNullableText(values.prompt),
    })
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(submit)}>
        <AiAssessmentRuleDetailDocTypeField
          control={form.control}
          isLoading={isLoading}
          options={options}
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          {(['minThreshold', 'maxThreshold'] as const).map((name) => (
            <FormField
              control={form.control}
              key={name}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(`aiAssessmentRules.fields.${name}`)}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      numerical
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        {(['methodNames', 'prompt'] as const).map((name) => (
          <FormField
            control={form.control}
            key={name}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(`aiAssessmentRules.fields.${name}`)}</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
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
                  readOnly={isPending}
                  ref={field.ref}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            disabled={isPending}
            onClick={onCancel}
            type='button'
            variant='outline'
          >
            {t('common.cancel')}
          </Button>
          <Button aria-busy={isPending} disabled={isPending} type='submit'>
            {isPending ? t('common.loading') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
