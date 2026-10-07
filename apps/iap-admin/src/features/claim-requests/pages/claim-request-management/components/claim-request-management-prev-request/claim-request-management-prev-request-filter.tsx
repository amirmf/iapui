import { useCallback, useMemo } from 'react'

import { type ClaimRequest } from '@iap/api-types'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { useDocTypesData } from '@modules/doc-types'
import { TableFilterFacetedFilter } from '@shared/tables'
import { IconRefresh } from '@tabler/icons-react'
import { type ColumnFiltersState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

const tmpFilters = [
  { id: 'all', label: 'all' },
  { id: 'extNationalCode', label: 'primaryInsured' },
  { id: 'extNationalCode__neq', label: 'coveredInsured' },
]

const nationalCodeFilterIds = tmpFilters
  .filter((filter) => filter.id !== 'all')
  .map((filter) => filter.id)

interface ClaimRequestHistoryFilterProps {
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: (
    updater:
      ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void
  refetch: () => void
  isLoading?: boolean
  claimRequest?: ClaimRequest
}

function ClaimRequestManagementPrevRequestFilter(
  props: ClaimRequestHistoryFilterProps
) {
  const {
    columnFilters,
    onColumnFiltersChange,
    refetch,
    isLoading,
    claimRequest,
  } = props
  const { t } = useTranslation()
  const { options } = useDocTypesData.options()

  const docTypeFilterValue = useMemo(() => {
    const value = columnFilters.find((item) => item.id === 'docType.id')?.value
    return typeof value === 'string' || Array.isArray(value) ? value : undefined
  }, [columnFilters])

  const handleDocTypeFilterChange = useCallback(
    (id: string, value: string | string[] | undefined) => {
      onColumnFiltersChange((old) => {
        const next = old.filter((filter) => filter.id !== id)
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return next
        }
        return [...next, { id, value }]
      })
    },
    [onColumnFiltersChange]
  )

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <TableFilterFacetedFilter
        id='docType.id'
        placeholder={t('claimRequests.columns.docType')}
        options={options}
        values={{ 'docType.id': docTypeFilterValue }}
        onValueChange={handleDocTypeFilterChange}
        presentation='reference'
        className='mx-1'
      />
      {tmpFilters.map((filter) => {
        const isSelected = columnFilters.length
          ? filter.id === 'all'
            ? !columnFilters.some((item) =>
                nationalCodeFilterIds.includes(item.id)
              )
            : columnFilters.some((item) => item.id === filter.id)
          : filter.id === 'all'
        return (
          <Button
            presentation='reference'
            key={filter.id}
            variant={isSelected ? 'default' : 'outline'}
            size='sm'
            className='text-xs font-medium'
            disabled={isLoading}
            onClick={() => {
              if (filter.id === 'all') {
                onColumnFiltersChange((old) =>
                  old.filter((item) => !nationalCodeFilterIds.includes(item.id))
                )
              } else {
                if (!isSelected) {
                  onColumnFiltersChange((old) => [
                    ...old.filter(
                      (item) => !nationalCodeFilterIds.includes(item.id)
                    ),
                    {
                      id: filter.id,
                      value: claimRequest?.extNationalCode,
                    },
                  ])
                }
              }
            }}
          >
            {filter.id === 'all'
              ? t(`common.all`)
              : t(`claimRequests.filters.${filter.label}` as never)}
          </Button>
        )
      })}
      <Button
        presentation='reference'
        onClick={refetch}
        variant='outline'
        size='sm'
        className='text-xs font-medium'
        disabled={isLoading}
      >
        <IconRefresh size={18} className={cn(isLoading && 'animate-spin')} />
        {t('claimRequests.refresh')}
      </Button>
    </div>
  )
}

export default ClaimRequestManagementPrevRequestFilter
