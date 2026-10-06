import type { ComponentProps, ReactNode } from 'react'

import type { DatePickerLocale, Input } from '@iap/ui'

export type TableFilterValue = string | string[] | undefined
export type TableFilterValues = Record<string, TableFilterValue>
export type TableFilterOption = { label: string; value: string }

type BaseConfig = { className?: string; id: string; wrapperClassName?: string }

export type TextTableFilterConfig = BaseConfig & {
  asLike?: boolean
  debounceMs?: number
  inputMode?: ComponentProps<typeof Input>['inputMode']
  numerical?: boolean
  placeholder?: string
  queryKey?: string
}

export type NumberRangeTableFilterConfig = BaseConfig & {
  fromKey?: string
  fromPlaceholder?: string
  numberWithComma?: boolean
  toKey?: string
  toPlaceholder?: string
}

export type DateRangeTableFilterConfig = BaseConfig & {
  debounceMs?: number
  fromKey?: string
  fromPlaceholder?: string
  locale?: DatePickerLocale
  mode?: 'date' | 'date-time'
  toKey?: string
  toPlaceholder?: string
}

export type FacetedTableFilterConfig = BaseConfig & {
  debounceMs?: number
  disabled?: boolean
  multiple?: boolean
  options: readonly TableFilterOption[]
  placeholder?: string
  searchPlaceholder?: string
}

export type TableFilterBaseProps = {
  presentation?: 'default' | 'reference'
  children?: ReactNode
  className?: string
  dateRangeFilters?: readonly DateRangeTableFilterConfig[]
  dateTimeRangeFilters?: readonly DateRangeTableFilterConfig[]
  defaultVisibleFilterCount?: number
  facetedFilters?: readonly FacetedTableFilterConfig[]
  labels?: { collapse?: string; expand?: string; reset?: string }
  numberRangeFilters?: readonly NumberRangeTableFilterConfig[]
  textFilters?: readonly TextTableFilterConfig[]
}
