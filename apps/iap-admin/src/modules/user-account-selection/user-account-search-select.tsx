import { useMemo, useState } from 'react'

import type { PartyRole } from '@iap/api-types'
import { useDebouncedValue } from '@iap/react-hooks'
import { SearchableSelect, Select } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { userAccountSelectionService } from './services/user-account-selection-service'

type UserAccountSearchSelectProps = {
  branchLocationsId?: string | null
  disabled?: boolean
  excludeUserAccountId?: string | null
  onChange: (value: string | undefined) => void
  parentUserAccountId?: string | null
  placeholder?: string
  roles?: PartyRole | null
  value?: string | null
  presentation?: 'default' | 'reference'
  valueMode?: 'id' | 'username'
}

export function UserAccountSearchSelect(props: UserAccountSearchSelectProps) {
  const {
    branchLocationsId,
    disabled,
    excludeUserAccountId,
    onChange,
    parentUserAccountId,
    placeholder,
    roles,
    value,
    valueMode = 'id',
    presentation = 'default',
  } = props
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = useState('')
  const text = useDebouncedValue(searchValue.trim(), 700)
  const usersQuery = useQuery({
    enabled: !disabled,
    queryFn: ({ signal }) =>
      userAccountSelectionService.list(
        {
          branchLocations__in: branchLocationsId ?? undefined,
          excludeUserAccountId: excludeUserAccountId ?? undefined,
          parentUserAccountId: parentUserAccountId ?? undefined,
          roles: roles ?? undefined,
          text,
        },
        signal
      ),
    queryKey: [
      'user-accounts',
      'search-user',
      text,
      roles,
      excludeUserAccountId,
      branchLocationsId,
      parentUserAccountId,
    ],
  })
  const options = useMemo(
    () =>
      (usersQuery.data ?? []).map((user) => ({
        label: user.displayName ?? user.username,
        value: user[valueMode],
      })),
    [usersQuery.data, valueMode]
  )
  const selectedUserByIdQuery = useQuery({
    enabled:
      !disabled &&
      Boolean(value) &&
      !options.some((item) => item.value === value),
    queryFn: ({ signal }) =>
      valueMode === 'username'
        ? userAccountSelectionService.getByLookupValue(value ?? '', signal)
        : userAccountSelectionService.getById(value ?? '', signal),
    queryKey: ['user-account', 'by-id', value],
    staleTime: 30_000,
    gcTime: 30_000,
  })
  const selected = useMemo(() => {
    const user = selectedUserByIdQuery.data
    return user?.id
      ? {
          label: user.displayName ?? user.username,
          value: user[valueMode],
        }
      : options.find((option) => option.value === value)
  }, [options, selectedUserByIdQuery.data, value, valueMode])

  if (presentation === 'reference')
    return (
      <SearchableSelect
        presentation='reference'
        value={value}
        selected={selected ?? null}
        onChange={onChange}
        items={options}
        placeholder={placeholder}
        disabled={disabled}
        isLoading={usersQuery.isFetching}
        onSearch={setSearchValue}
        shouldFilter={false}
        selectText={t('common.select')}
        loadingText={t('common.loading')}
        emptyText={t('common.noResults')}
        clearText={t('common.clear')}
      />
    )

  return (
    <Select
      clearable
      disabled={disabled}
      isLoading={usersQuery.isFetching || selectedUserByIdQuery.isFetching}
      labelKey='label'
      loadingText={t('common.loading')}
      onSearch={setSearchValue}
      onValueChange={(option) => onChange(option?.value as string | undefined)}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={placeholder}
      shouldFilter={false}
      showSearch
      value={selected}
      valueKey='value'
    />
  )
}
