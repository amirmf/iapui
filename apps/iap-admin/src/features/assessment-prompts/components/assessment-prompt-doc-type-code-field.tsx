import type { AssessmentPromptForm } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext } from 'react-hook-form'

type AssessmentPromptDocTypeCodeFieldProps = {
  enabled: boolean
}

export function AssessmentPromptDocTypeCodeField(
  props: AssessmentPromptDocTypeCodeFieldProps
) {
  const { enabled } = props
  const { t } = useTranslate()
  const { control } = useFormContext<AssessmentPromptForm>()
  const { options, isLoading } = useDocTypesData.optionsCode({ enabled })

  return (
    <FormField
      control={control}
      name='docTypeCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('assessmentPrompts.dialog.fields.docType')}</FormLabel>
          <FormControl>
            <SearchableSelect
              isLoading={isLoading}
              loadingText={t('common.loading')}
              emptyText={t('common.noResults')}
              clearText={t('common.clear')}
              selectText={t('common.select')}
              onBlur={field.onBlur}
              onChange={field.onChange}
              items={options}
              placeholder={t('assessmentPrompts.dialog.fields.docType')}
              ref={field.ref}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
