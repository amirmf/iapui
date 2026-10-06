import { useEffect, useMemo, useState } from 'react'

import { useAssignementRuleAgreements } from '@features/assignement-rules/queries/use-assignement-rule-agreements'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

interface AgreementPolicyIdFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  placeholder: string
  enabled?: boolean
  isEdit?: boolean
}

function useDebouncedValue(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}

export function AgreementPolicyIdField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
>(props: AgreementPolicyIdFieldProps<TFieldValues, TName>) {
  const {
    control,
    name,
    label,
    placeholder,
    enabled = true,
    isEdit = false,
  } = props
  const value = useWatch({ control, name })
  const selectedFieldValue =
    typeof value === 'string' && value !== '' ? value : undefined

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm.trim())

  const { agreementPage, isFetching, selectedAgreementPage } =
    useAssignementRuleAgreements({
      enabled,
      isEdit,
      debouncedSearch,
      selectedFieldValue,
    })

  const options = useMemo(
    () =>
      (agreementPage?.content ?? []).flatMap((agreement) => {
        const optionValue = agreement.extPolicyId
        return optionValue == null
          ? []
          : [{ label: agreement.title ?? '', value: String(optionValue) }]
      }),
    [agreementPage]
  )

  const selectedAgreement = selectedAgreementPage?.content[0]
  const selectedFromLookup = useMemo(() => {
    if (!selectedAgreement || selectedAgreement.extPolicyId == null) return null
    return {
      label: selectedAgreement.title ?? '',
      value: String(selectedAgreement.extPolicyId),
    }
  }, [selectedAgreement])

  const selectedFallback = selectedFieldValue
    ? { label: selectedFieldValue, value: selectedFieldValue }
    : undefined

  const selected =
    selectedFromLookup ??
    options.find((opt) => opt.value === selectedFieldValue) ??
    selectedFallback

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <SearchableSelect
              disabled={!enabled}
              isLoading={isFetching}
              items={options}
              onChange={field.onChange}
              onSearch={setSearchTerm}
              placeholder={placeholder}
              selected={selected}
              shouldFilter={false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
