import type { AiAssessmentRuleForm } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { MultiSelect } from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types'
import { useTranslate } from '@shared/i18n/i18n'
import type { Control } from 'react-hook-form'

interface AiAssessmentRuleDocTypesFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<AiAssessmentRuleForm, any, any>
}

export function AiAssessmentRuleDocTypesField({
  control,
}: AiAssessmentRuleDocTypesFieldProps) {
  const { t } = useTranslate()
  const { data, isLoading, options } = useDocTypesData.optionsCode()

  const toDocTypes = (docTypeCodes: string[]) =>
    docTypeCodes.flatMap((docTypeCode) => {
      const docType = data?.find((item) => item.docTypeCode === docTypeCode)
      return docType ? [docType] : []
    })

  return (
    <FormField
      control={control}
      name='docTypes'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('aiAssessmentRules.fields.docTypes')}</FormLabel>
          <FormControl>
            <MultiSelect
              disabled={isLoading}
              isLoading={isLoading}
              labelKey='label'
              onValueChange={(selectedItems) => {
                const docTypeCodes = selectedItems.map((item) => item.value)
                field.onChange(toDocTypes(docTypeCodes))
              }}
              options={options}
              placeholder={t('aiAssessmentRules.placeholder.docTypes')}
              value={options.filter((option) =>
                (field.value ?? []).some(
                  (docType) => docType.docTypeCode === option.value
                )
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
