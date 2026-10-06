import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { Select } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { AssignementRuleForm } from '../model/assignement-rule-form-schema'

export function AssignementRuleDocTypeCodeField({
  enabled,
}: {
  enabled: boolean
}) {
  const { t } = useTranslation()
  const { control } = useFormContext<AssignementRuleForm>()

  const docTypesQuery = useQuery({
    enabled,
    queryFn: ({ signal }) =>
      docTypeService.getPage({ page: 0, signal, size: 100 }),
    queryKey: ['doc-types', 'page', 0, 100],
    staleTime: Infinity,
  })

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
