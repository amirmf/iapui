import { useMemo } from 'react'

import type { MyClaimRequestsFilterFormValues } from '@features/my-claims/model/filter-values'
import useGetMySubInsuredPeople from '@features/my-claims/queries/use-get-my-sub-insured-people'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type MyClaimMyNationalCodeFormFieldProps = {
  label?: string
  placeholder?: string
  isRequired?: boolean
  isFilter?: boolean
}

function MyClaimMyNationalCodeFormField(
  props: MyClaimMyNationalCodeFormFieldProps
) {
  const { label, placeholder, isRequired = true } = props
  const { control } = useFormContext<MyClaimRequestsFilterFormValues>()
  const { t } = useTranslation()
  const selectedPolicyId = useWatch({
    control,
    name: 'extPolicyId',
  })

  // Fetch sub-insured people based on selected policy
  const { data: subInsuredPeople, isLoading: isSubInsuredPeopleLoading } =
    useGetMySubInsuredPeople({ policyId: selectedPolicyId })

  const subInsuredPeopleItems = useMemo(() => {
    return (subInsuredPeople ?? []).map((person) => {
      let label = person.fullName
      if (person.isForeign === 'Y') {
        label =
          `${label} (${person.nationalCode}-${t('claimRequests.dialog.fields.foreign')})`.trim()
      } else {
        label = `${label} (${person.nationalCode})`.trim()
      }
      return {
        label,
        value: String(person.nationalCode),
      }
    })
  }, [subInsuredPeople, t])

  const renderedLabel =
    label ?? t('claimRequests.dialog.fields.subInsuredPerson')
  const placeholderText =
    placeholder ?? t('claimRequests.dialog.fields.selectSubInsuredPerson')

  return (
    <FormField
      control={control}
      name='extNationalCode'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {renderedLabel}
            {isRequired && <span className='text-destructive'>*</span>}
          </FormLabel>
          <FormControl>
            <SearchableSelect
              presentation='reference'
              loadingText={t('common.loading')}
              emptyText={t('common.noResults')}
              clearText={t('common.clear')}
              value={field.value}
              onChange={(value) => {
                field.onChange(value)
              }}
              items={subInsuredPeopleItems}
              placeholder={placeholderText}
              isLoading={isSubInsuredPeopleLoading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default MyClaimMyNationalCodeFormField
