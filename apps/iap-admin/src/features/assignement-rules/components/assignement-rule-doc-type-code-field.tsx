import type { AssignementRuleForm } from '@features/assignement-rules/model/assignement-rule-form-schema'
import { useAssignementRuleDocTypes } from '@features/assignement-rules/queries/use-assignement-rule-doc-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Select } from '@iap/ui'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function AssignementRuleDocTypeCodeField(props: { enabled: boolean }) {
  const { enabled } = props
  const { t } = useTranslation()
  const { control } = useFormContext<AssignementRuleForm>()

  const docTypesQuery = useAssignementRuleDocTypes(enabled)

  const options = (docTypesQuery.data?.content ?? [])
    .filter(
      (item): item is typeof item & { docTypeCode: string } =>
        typeof item.docTypeCode === 'string'
    )
    .map((item) => ({
      label: item.docType ?? item.docTypeCode,
      value: item.docTypeCode,
    }))

  return (
    <FormField
      control={control}
      name='docTypeCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('assignementRules.fields.docTypeCode')}</FormLabel>
          <FormControl>
            <Select
              clearable
              disabled={!enabled}
              isLoading={docTypesQuery.isLoading}
              labelKey='label'
              onValueChange={(option) => field.onChange(option?.value)}
              options={options}
              placeholder={t('assignementRules.fields.docTypeCode')}
              showSearch
              value={options.find((opt) => opt.value === field.value)}
              valueKey='value'
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
