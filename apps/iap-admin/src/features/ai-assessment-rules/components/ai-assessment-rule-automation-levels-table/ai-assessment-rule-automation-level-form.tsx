import { useEffect, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type AiAssessmentRuleAutomationLevelForm as AiAssessmentRuleAutomationLevelFormValues,
  type AiAssessmentRuleAutomationLevelItem,
  aiAssessmentRuleAutomationLevelFormSchema,
} from '@iap/api-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Button, Input, SingleSelect } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useForm } from 'react-hook-form'

import { getAiAssessmentRuleAutomationLevelOptions } from '../../constants/ai-assessment-rule-constant'

interface AiAssessmentRuleAutomationLevelFormProps {
  automationLevel?: AiAssessmentRuleAutomationLevelItem
  isPending: boolean
  onCancel: () => void
  onSubmit: (automationLevel: AiAssessmentRuleAutomationLevelItem) => void
}

function toFormValues(
  automationLevel?: AiAssessmentRuleAutomationLevelItem
): AiAssessmentRuleAutomationLevelFormValues {
  return {
    automationLevel: automationLevel?.automationLevel ?? 'HINT',
    maxThreshold: automationLevel?.maxThreshold?.toString() ?? '',
    minThreshold: automationLevel?.minThreshold?.toString() ?? '',
  }
}

export function AiAssessmentRuleAutomationLevelForm({
  automationLevel,
  isPending,
  onCancel,
  onSubmit,
}: AiAssessmentRuleAutomationLevelFormProps) {
  const { t } = useTranslate()
  const form = useForm<AiAssessmentRuleAutomationLevelFormValues>({
    defaultValues: toFormValues(automationLevel),
    resolver: zodResolver(aiAssessmentRuleAutomationLevelFormSchema(t)),
  })
  const levelOptions = useMemo(
    () => getAiAssessmentRuleAutomationLevelOptions(t),
    [t]
  )

  useEffect(() => {
    form.reset(toFormValues(automationLevel))
  }, [automationLevel, form])

  const handleSubmit = (values: AiAssessmentRuleAutomationLevelFormValues) => {
    onSubmit({
      automationLevel: values.automationLevel,
      maxThreshold: Number(values.maxThreshold),
      minThreshold: Number(values.minThreshold),
    })
  }

  return (
    <Form {...form}>
      <form
        aria-busy={isPending}
        className='space-y-4'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name='automationLevel'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('aiAssessmentRules.fields.automationLevel')}
              </FormLabel>
              <FormControl>
                <SingleSelect
                  canClear={false}
                  disabled={isPending}
                  items={levelOptions}
                  onChange={field.onChange}
                  selectText={t('common.select')}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
