import { useEffect, useMemo, useState } from 'react'

import { agreementService } from '@features/agreements'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
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
>({
  control,
  name,
  label,
  placeholder,
  enabled = true,
  isEdit = false,
}: AgreementPolicyIdFieldProps<TFieldValues, TName>) {
  const value = useWatch({ control, name })
  const selectedFieldValue =
    typeof value === 'string' && value !== '' ? value : undefined

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm.trim())

  const { data: agreementPage, isFetching } = useQuery({
    enabled,
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: debouncedSearch ? { title: debouncedSearch } : {},
        page: 0,
        signal,
        size: 20,
      }),
    queryKey: ['agreement-options', 'extPolicyId', debouncedSearch],
    staleTime: 30_000,
  })

  const { data: selectedAgreementPage } = useQuery({
    enabled: enabled && isEdit && Boolean(selectedFieldValue),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: { extPolicyId: selectedFieldValue! },
        page: 0,
        signal,
        size: 1,
      }),
    queryKey: ['agreement-selected-option', 'extPolicyId', selectedFieldValue],
    staleTime: 30_000,
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
