import type { AssessmentPromptForm } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SingleSelect } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useFormContext } from 'react-hook-form'

const EMPTY_PLACE_TYPE = '__NONE__'

export function AssessmentPromptEnumField(props: {
  label: string
  name: 'placeType' | 'ruleState' | 'status'
  options: { label: string; value: string }[]
}) {
  const { label, name, options } = props
  const { t } = useTranslate()
  const { control } = useFormContext<AssessmentPromptForm>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <SingleSelect
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) =>
                field.onChange(value === EMPTY_PLACE_TYPE ? null : value)
              }
              items={options}
              ref={field.ref}
              value={
                name === 'placeType'
                  ? (field.value ?? EMPTY_PLACE_TYPE)
                  : field.value
              }
              selectText={t('common.select')}
              loadingText={t('common.loading')}
              emptyText={t('common.noResults')}
              clearText={t('common.clear')}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
