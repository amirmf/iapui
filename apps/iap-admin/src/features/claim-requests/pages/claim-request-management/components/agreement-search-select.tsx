import { useEffect, useState } from 'react'

import { agreementService } from '@features/agreements'
import { SearchableSelect } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

export function AgreementSearchSelect(props: {
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  enabled?: boolean
}) {
  const { value, onChange, placeholder, disabled, enabled = true } = props
  const { t } = useTranslate()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      700
    )
    return () => window.clearTimeout(timer)
  }, [search])
  useEffect(() => {
    if (!enabled) setSearch('')
  }, [enabled])
  const query = useQuery({
    queryKey: ['agreements', 'search', debouncedSearch],
    queryFn: ({ signal }) =>
      agreementService.getPage({
        page: 0,
        size: 20,
        filters: debouncedSearch ? { title: debouncedSearch } : {},
        signal,
      }),
    enabled,
    staleTime: 30_000,
    gcTime: 30_000,
    refetchOnWindowFocus: false,
  })
  const items =
    query.data?.content.map((item) => ({
      label: item.title ?? item.code ?? item.id ?? '',
      value: item.id ?? '',
    })) ?? []
  return (
    <SearchableSelect
      selectText={t('common.select')}
      loadingText={t('common.loading')}
      emptyText={t('common.noResults')}
      clearText={t('common.clear')}
      presentation='reference'
      value={value}
      onChange={onChange}
      items={items}
      placeholder={
        placeholder ??
        t('agreements.select', { defaultValue: 'Select agreement' })
      }
      disabled={disabled}
      isLoading={query.isFetching}
      onSearch={setSearch}
      shouldFilter={false}
    />
  )
}
