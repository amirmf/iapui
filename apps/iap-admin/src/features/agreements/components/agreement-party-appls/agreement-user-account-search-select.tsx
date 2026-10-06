import { useEffect, useMemo, useState } from 'react'

import { Select } from '@iap/ui'
import { userAccountSelectionService } from '@modules/user-account-selection'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

interface AgreementUserAccountSearchSelectProps {
  value?: string | null
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  onlySelectedDisabled?: boolean
}

export function AgreementUserAccountSearchSelect(
  props: AgreementUserAccountSearchSelectProps
) {
  const { value, onChange, placeholder, disabled, onlySelectedDisabled } = props
  const { t } = useTranslate()
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchText.trim()), 700)
    return () => window.clearTimeout(timer)
  }, [searchText])

  const query = useQuery({
    queryKey: ['user-accounts', search],
    queryFn: ({ signal }) =>
      userAccountSelectionService.list({ text: search || undefined }, signal),
    enabled: !disabled,
  })
  const items = useMemo(
    () =>
      (query.data ?? []).map((user) => ({
        label: user.displayName ?? user.username,
        value: user.id,
      })),
    [query.data]
  )

  return (
    <Select
      clearable
      clearLabel={t('common.clear')}
      presentation='reference'
      selectedValue={value ?? undefined}
      disabled={disabled || onlySelectedDisabled}
      emptyText={t('common.noResults' as never)}
      isLoading={query.isFetching}
      loadingText={t('common.loading' as never)}
      labelKey='label'
      onSearch={setSearchText}
      onValueChange={(item) => onChange(item?.value)}
      options={items}
      placeholder={placeholder}
      searchPlaceholder={placeholder}
      shouldFilter={false}
      showSearch
      value={items.find((item) => item.value === value)}
      valueKey='value'
    />
  )
}
