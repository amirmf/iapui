import { cn } from '@iap/ui'
import { TableFilterDateRangeFilter } from '@shared/tables/filter/table-filter-date-range-filter'
import { TableFilterFacetedFilter } from '@shared/tables/filter/table-filter-faceted-filter'
import { TableFilterInput } from '@shared/tables/filter/table-filter-input'
import { TableFilterNumberRangeInput } from '@shared/tables/filter/table-filter-number-range-input'
import type {
  TableFilterBaseProps,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'

type Filter =
  | {
      config: NonNullable<TableFilterBaseProps['textFilters']>[number]
      kind: 'text'
    }
  | {
      config: NonNullable<TableFilterBaseProps['numberRangeFilters']>[number]
      kind: 'number'
    }
  | {
      config: NonNullable<TableFilterBaseProps['dateRangeFilters']>[number]
      kind: 'date'
    }
  | {
      config: NonNullable<TableFilterBaseProps['dateTimeRangeFilters']>[number]
      kind: 'date-time'
    }
  | {
      config: NonNullable<TableFilterBaseProps['facetedFilters']>[number]
      kind: 'faceted'
    }

export function TableFilterContent(
  props: TableFilterBaseProps & {
    expanded: boolean
    onValueChange: (id: string, value: TableFilterValue) => void
    values: TableFilterValues
  }
) {
  const {
    children,
    className,
    dateRangeFilters = [],
    dateTimeRangeFilters = [],
    defaultVisibleFilterCount = 6,
    expanded,
    facetedFilters = [],
    numberRangeFilters = [],
    onValueChange,
    presentation = 'default',
    textFilters = [],
    values,
  } = props
  const filters: Filter[] = [
    ...textFilters.map((config) => ({ config, kind: 'text' as const })),
    ...numberRangeFilters.map((config) => ({
      config,
      kind: 'number' as const,
    })),
    ...dateRangeFilters.map((config) => ({ config, kind: 'date' as const })),
    ...dateTimeRangeFilters.map((config) => ({
      config: { ...config, mode: 'date-time' as const },
      kind: 'date-time' as const,
    })),
    ...facetedFilters.map((config) => ({ config, kind: 'faceted' as const })),
  ]
  const visibleFilters = expanded
    ? filters
    : filters.slice(0, defaultVisibleFilterCount)

  return (
    <div
      className={cn(
        presentation === 'reference'
          ? '-mx-2 flex flex-1 flex-col flex-wrap items-start gap-y-2 sm:flex-row sm:items-center'
          : 'flex flex-wrap items-center gap-2',
        className
      )}
    >
      {visibleFilters.map(({ config, kind }) => {
        const filterValue = values[config.id]
        const stringValue =
          typeof filterValue === 'string' ? filterValue : undefined
        const queryValue =
          kind === 'text' ? values[config.queryKey ?? config.id] : undefined
        const stringQueryValue =
          typeof queryValue === 'string' ? queryValue : stringValue
        if (kind === 'text')
          return (
            <TableFilterInput
              {...config}
              presentation={presentation}
              key={config.id}
              onValueChange={onValueChange}
              value={stringQueryValue}
            />
          )
        if (kind === 'number')
          return (
            <TableFilterNumberRangeInput
              presentation={presentation}
              {...config}
              key={config.id}
              onValueChange={onValueChange}
              values={values}
            />
          )
        if (kind === 'date' || kind === 'date-time')
          return (
            <TableFilterDateRangeFilter
              {...config}
              presentation={presentation}
              key={config.id}
              onValueChange={onValueChange}
              values={values}
            />
          )
        return (
          <TableFilterFacetedFilter
            {...config}
            presentation={presentation}
            key={config.id}
            onValueChange={onValueChange}
            values={values}
          />
        )
      })}
      {children}
    </div>
  )
}
