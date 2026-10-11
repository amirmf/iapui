import { useMemo, useState } from 'react'

import type { BranchLocation } from '@iap/api-types'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@iap/forms'
import { useDebouncedValue } from '@iap/react-hooks'
import { MultiSelect } from '@iap/ui'
import { branchService } from '@modules/branches'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'

type BranchLocationsFormValues = {
  branchLocations: BranchLocation[]
}

export function BranchLocationsForm(props: { isOpen?: boolean }) {
  const { isOpen = true } = props
  const { t } = useTranslate()
  const { control } = useFormContext<BranchLocationsFormValues>()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim(), 700)
  const branchesQuery = useQuery({
    enabled: isOpen,
    queryFn: ({ signal }) =>
      branchService.getPage({
        filters: {
          isActive: 1,
          unitKindId__in: '201,202',
          ...(debouncedSearch ? { unitName: debouncedSearch } : {}),
        },
        page: 0,
        signal,
        size: 40,
      }),
    queryKey: [
      'branches',
      'user-account-locations',
      debouncedSearch,
      1,
      '201,202',
    ],
  })
  const options = useMemo(
    () =>
      (branchesQuery.data?.content ?? [])
        .filter(
          (branch): branch is typeof branch & { code: number } =>
            typeof branch.code === 'number'
        )
        .map((branch) => ({
          label: `${branch.unitName ?? ''} - ${branch.code}`,
          value: branch as BranchLocation,
        })),
    [branchesQuery.data?.content]
  )

  return (
    <FormField
      control={control}
      name='branchLocations'
      render={({ field }) => {
        const selected = field.value.map((branch) => ({
          label: branch.unitName ?? String(branch.code ?? ''),
          value: branch,
        }))
        const mergedOptions = [...selected, ...options]

        return (
          <FormItem>
            <FormLabel>
              {t('parties.userAccount.fields.branchLocations')}
            </FormLabel>
            <FormControl>
              <MultiSelect
                isLoading={branchesQuery.isLoading || branchesQuery.isFetching}
                labelKey='label'
                loadingText={t('common.loading')}
                onSearch={setSearch}
                onValueChange={(value) =>
                  field.onChange(value.map((option) => option.value))
                }
                options={mergedOptions}
                placeholder={t(
                  'parties.userAccount.placeholders.branchLocations'
                )}
                searchPlaceholder={t('parties.filterPlaceholder')}
                shouldFilter={false}
                value={selected}
                valueKey='value.code'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
