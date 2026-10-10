import { useMemo } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SupportFeatureButton } from '@iap/support'
import { SearchableSelect } from '@iap/ui'
import { useGetMySubInsuredPeople } from '@modules/sub-insured-people'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export type MyClaimMyNationalCodeFormFieldProps = {
  featureKey?: string
  isFilter?: boolean
  isRequired?: boolean
  label?: string
  placeholder?: string
}

export function MyClaimMyNationalCodeFormField(
  props: MyClaimMyNationalCodeFormFieldProps
) {
  const {
    featureKey,
    isFilter = false,
    isRequired = true,
    label,
    placeholder,
  } = props
  const { control } = useFormContext()
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
      let itemLabel = person.fullName
      if (person.isForeign === 'Y') {
        itemLabel =
          `${itemLabel} (${person.nationalCode}-${t('claimRequests.dialog.fields.foreign')})`.trim()
      } else {
        itemLabel = `${itemLabel} (${person.nationalCode})`.trim()
      }
      return {
        label: itemLabel,
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
            {featureKey && (
              <SupportFeatureButton
                featureKey={featureKey}
                size='xs'
                variant='secondary'
              />
            )}
          </FormLabel>
          <FormControl>
            <SearchableSelect
              isLoading={isSubInsuredPeopleLoading}
              items={subInsuredPeopleItems}
              onChange={(value) => {
                if (isFilter) {
                  field.onChange(value)
                } else {
                  const selectedItem = subInsuredPeople?.find(
                    (item) => item.nationalCode === value
                  )
                  field.onChange(
                    selectedItem || {
                      fullName: '',
                      id: 0,
                      nationalCode: '',
                    }
                  )
                }
              }}
              placeholder={placeholderText}
              value={
                isFilter
                  ? typeof field.value === 'string'
                    ? field.value
                    : field.value?.nationalCode
                  : field.value?.nationalCode
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default MyClaimMyNationalCodeFormField
