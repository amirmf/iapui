import { MultiSelect, Select } from '@iap/ui'
import type {
  FacetedTableFilterConfig,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function TableFilterFacetedFilter(
  props: FacetedTableFilterConfig & {
    onValueChange: (id: string, value: string | string[] | undefined) => void
    values: TableFilterValues
  }
) {
  const {
    className,
    disabled,
    id,
    multiple = true,
    onValueChange,
    options,
    placeholder = id,
    searchPlaceholder,
    values,
  } = props
  const value = values[id]
  const selected = options.filter((option) =>
    Array.isArray(value) ? value.includes(option.value) : value === option.value
  )

  return multiple ? (
    <MultiSelect
      className={className}
      clearable
      disabled={disabled}
      labelKey='label'
      onValueChange={(next) =>
        onValueChange(
          id,
          next.map((option) => option.value)
        )
      }
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      value={selected}
      valueKey='value'
    />
  ) : (
    <Select
      className={className}
      clearable
      disabled={disabled}
      labelKey='label'
      onValueChange={(next) => onValueChange(id, next?.value)}
      options={options}
      placeholder={placeholder}
      showSearch
      value={selected[0]}
      valueKey='value'
    />
  )
}
