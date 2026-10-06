import { useEffect, useMemo, useState } from 'react'

import { agreementService } from '@features/agreements'
import type { Agreement } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useWatch,
} from 'react-hook-form'

export type AgreementFieldValueType =
  'extContractId' | 'extPolicyId' | 'templateCode'

export interface AgreementFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<TFieldValues, any, any>
  enabled?: boolean
  isEdit?: boolean
  label: string
  name: TName
  placeholder: string
  valueType: AgreementFieldValueType
}

const agreementValue = (
  agreement: Agreement,
  valueType: AgreementFieldValueType
) => agreement[valueType]

function useDebouncedTextSearch(delay = 500) {
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(text.trim())
    }, delay)
    return () => clearTimeout(handler)
  }, [text, delay])

  return {
    search,
    setSearch: setText,
    text,
  }
}

export function AgreementField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string | undefined>,
>({
  control,
  enabled = true,
  isEdit = false,
  label,
  name,
  placeholder,
  valueType,
}: AgreementFieldProps<TFieldValues, TName>) {
  const value = useWatch({ control, name })
  const selectedFieldValue = typeof value === 'string' ? value : undefined
  const { search, setSearch } = useDebouncedTextSearch()

  const { data: agreementPage, isFetching } = useQuery({
    enabled,
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: search ? { title: search } : {},
        page: 0,
        signal,
        size: 20,
      }),
    queryKey: ['agreement-options', valueType, search],
    staleTime: 30_000,
  })

  const { data: selectedAgreementPage } = useQuery({
    enabled: enabled && isEdit && Boolean(selectedFieldValue),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      agreementService.getPage({
        filters: { [valueType]: selectedFieldValue },
        page: 0,
        signal,
        size: 1,
      }),
    queryKey: ['agreement-selected-option', valueType, selectedFieldValue],
    staleTime: 30_000,
  })

  const options = useMemo(
    () =>
      (agreementPage?.content ?? []).flatMap((agreement) => {
        const optionValue = agreementValue(agreement, valueType)

        return optionValue == null
          ? []
          : [{ label: agreement.title ?? '', value: String(optionValue) }]
      }),
    [agreementPage, valueType]
  )

  const selectedAgreement = selectedAgreementPage?.content[0]
  const selectedFromLookup = useMemo(() => {
    if (!selectedAgreement) return null

    const optionValue = agreementValue(selectedAgreement, valueType)
    return optionValue == null
      ? null
      : { label: selectedAgreement.title ?? '', value: String(optionValue) }
  }, [selectedAgreement, valueType])

  const selectedFallback = selectedFieldValue
    ? { label: selectedFieldValue, value: selectedFieldValue }
    : null

  const selected =
    selectedFromLookup ??
    options.find((option) => option.value === selectedFieldValue) ??
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
              onSearch={setSearch}
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
