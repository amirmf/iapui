import {
  fromDateRangeKey,
  fromNumberRangeKey,
  likeKey,
  toDateRangeKey,
  toNumberRangeKey,
} from '@iap/shared-lib'
import { cn } from '@iap/ui'
import { TableFilterDateRangeFilter } from '@shared/tables/filter/table-filter-date-range-filter'
import { TableFilterFacetedFilter } from '@shared/tables/filter/table-filter-faceted-filter'
import { TableFilterInput } from '@shared/tables/filter/table-filter-input'
import { TableFilterNumberRangeInput } from '@shared/tables/filter/table-filter-number-range-input'
import type {
  TableFilterGroupItem,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function GroupedTableFilterItem(props: {
  filter: TableFilterGroupItem
  values: TableFilterValues
  onValueChange: (id: string, value: TableFilterValue) => void
  presentation: 'default' | 'reference'
}) {
  const { filter, values, onValueChange, presentation } = props
  if (filter.type === 'text') {
    const { asLike, ...config } = filter.config
    const queryKey =
      config.queryKey ?? (asLike ? `${config.id}${likeKey}` : config.id)
    const value = values[queryKey]
    return (
      <TableFilterInput
        {...config}
        queryKey={queryKey}
        value={typeof value === 'string' ? value : undefined}
        onValueChange={onValueChange}
        presentation={presentation}
        wrapperClassName={cn(config.wrapperClassName, 'w-full')}
      />
    )
  }
  if (filter.type === 'numberRange') {
    return (
      <TableFilterNumberRangeInput
        {...filter.config}
        className={cn(filter.config.className, 'w-full')}
        fromKey={
          filter.config.fromKey ?? `${filter.config.id}${fromNumberRangeKey}`
        }
        toKey={filter.config.toKey ?? `${filter.config.id}${toNumberRangeKey}`}
        values={values}
        onValueChange={onValueChange}
      />
    )
  }
  if (filter.type === 'dateRange' || filter.type === 'dateTimeRange') {
    return (
      <TableFilterDateRangeFilter
        {...filter.config}
        fromKey={
          filter.config.fromKey ?? `${filter.config.id}${fromDateRangeKey}`
        }
        toKey={filter.config.toKey ?? `${filter.config.id}${toDateRangeKey}`}
        mode={filter.type === 'dateTimeRange' ? 'date-time' : 'date'}
        className={cn(filter.config.className, 'w-full lg:w-full')}
        wrapperClassName={cn(filter.config.wrapperClassName, 'w-full')}
        values={values}
        onValueChange={onValueChange}
        presentation={presentation}
      />
    )
  }
  return (
    <TableFilterFacetedFilter
      {...filter.config}
      triggerClassName='w-full justify-start text-muted-foreground'
      values={values}
      onValueChange={onValueChange}
      presentation={presentation}
    />
  )
}
