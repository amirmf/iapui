import type { ComponentProps } from 'react'

import type { AiAssessmentRuleDetailForm } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import type { Control } from 'react-hook-form'

interface AiAssessmentRuleDetailDocTypeFieldProps {
  control: Control<AiAssessmentRuleDetailForm>
  isLoading: boolean
  options: ComponentProps<typeof SearchableSelect>['items']
}

export function AiAssessmentRuleDetailDocTypeField({
  control,
  isLoading,
  options,
}: AiAssessmentRuleDetailDocTypeFieldProps) {
  const { t } = useTranslate()

  return (
    <FormField
      control={control}
      name='docTypeCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('aiAssessmentRules.fields.docTypeCode')}</FormLabel>
          <FormControl>
            <SearchableSelect
              isLoading={isLoading}
              items={options}
              onChange={(value) => field.onChange(value ?? '')}
              placeholder={t(
                'aiAssessmentRules.ruleDetails.docTypePlaceholder'
              )}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
