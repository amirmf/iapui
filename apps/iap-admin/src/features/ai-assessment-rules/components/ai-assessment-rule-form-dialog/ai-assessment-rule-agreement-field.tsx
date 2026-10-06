import { useEffect, useMemo, useState } from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { SearchableSelect } from '@iap/ui'
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useWatch,
} from 'react-hook-form'

import {
  type AgreementFieldValueType,
  getAgreementOptionValue,
  useAgreementOptionsQuery,
  useSelectedAgreementQuery,
} from '../../queries/use-agreement-options'

export type { AgreementFieldValueType }

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

  const { data: agreementPage, isFetching } = useAgreementOptionsQuery({
    enabled,
    search,
    valueType,
  })

  const { data: selectedAgreementPage } = useSelectedAgreementQuery({
    enabled,
    isEdit,
    selectedValue: selectedFieldValue,
    valueType,
  })

  const options = useMemo(
    () =>
      (agreementPage?.content ?? []).flatMap((agreement) => {
        const optionValue = getAgreementOptionValue(agreement, valueType)
        return optionValue == null
          ? []
          : [{ label: agreement.title ?? '', value: String(optionValue) }]
      }),
    [agreementPage, valueType]
  )

  const selectedAgreement = selectedAgreementPage?.content[0]
  const selectedFromLookup = useMemo(() => {
    if (!selectedAgreement) return null
    const optionValue = getAgreementOptionValue(selectedAgreement, valueType)
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
