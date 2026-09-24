/* eslint-disable react-refresh/only-export-components */
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import {
  Button,
  type DatePickerLocale,
  DateRangePicker,
  Input,
  MultiSelect,
  Select,
  cn,
} from '@iap/ui'

export type TableFilterValue = string | string[] | undefined
export type TableFilterValues = Record<string, TableFilterValue>
export type TableFilterOption = { label: string; value: string }

export const tableFilterKeys = {
  dateFrom: (id: string) => `${id}From`,
  dateTo: (id: string) => `${id}To`,
  numberFrom: (id: string) => `${id}From`,
  numberTo: (id: string) => `${id}To`,
}

type BaseConfig = { className?: string; id: string }

export type TextTableFilterConfig = BaseConfig & {
  debounceMs?: number
  inputMode?: ComponentProps<typeof Input>['inputMode']
  numerical?: boolean
  placeholder?: string
}

export type NumberRangeTableFilterConfig = BaseConfig & {
  fromPlaceholder?: string
  numberWithComma?: boolean
  toPlaceholder?: string
}

export type DateRangeTableFilterConfig = BaseConfig & {
  fromPlaceholder?: string
  locale?: DatePickerLocale
  mode?: 'date' | 'date-time'
  toPlaceholder?: string
}

export type FacetedTableFilterConfig = BaseConfig & {
  disabled?: boolean
  multiple?: boolean
  options: readonly TableFilterOption[]
  placeholder?: string
  searchPlaceholder?: string
}

function hasFilterValue(value: TableFilterValue) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value)
}

function parseDate(value: TableFilterValue) {
  if (typeof value !== 'string' || !value) return undefined
  const date = new Date(`${value}T00:00:00`)

  return Number.isNaN(date.getTime()) ? undefined : date
}

function toDateValue(date: Date | undefined) {
  if (!date) return undefined

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function DebouncedFilterInput(
  props: TextTableFilterConfig & {
    onValueChange: (id: string, value: string | undefined) => void
    value?: string
  }
) {
  const {
    className,
    debounceMs = 400,
    id,
    onValueChange,
    value = '',
    ...inputProps
  } = props
  const [text, setText] = useState(value)

  useEffect(() => setText(value), [value])
  useEffect(() => {
    const timeout = window.setTimeout(
      () => onValueChange(id, text.trim() || undefined),
      debounceMs
    )

    return () => window.clearTimeout(timeout)
  }, [debounceMs, id, onValueChange, text])

  return (
    <div className='relative'>
      <Input
        {...inputProps}
        className={cn('pe-9', className)}
        onChange={(event) => setText(event.target.value)}
        value={text}
      />
      {text ? (
        <button
          aria-label={`Clear ${id}`}
          className='absolute end-2 top-1/2 size-7 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          onClick={() => setText('')}
          type='button'
        >
          ×
        </button>
      ) : null}
    </div>
  )
}

export function TableFilters(props: {
  children?: ReactNode
  className?: string
  dateRangeFilters?: readonly DateRangeTableFilterConfig[]
  defaultVisibleFilterCount?: number
  facetedFilters?: readonly FacetedTableFilterConfig[]
  labels?: { collapse?: string; expand?: string; reset?: string }
  numberRangeFilters?: readonly NumberRangeTableFilterConfig[]
  onValuesChange: (
    updater: (previous: TableFilterValues) => TableFilterValues
  ) => void
  textFilters?: readonly TextTableFilterConfig[]
  values: TableFilterValues
}) {
  const {
    children,
    className,
    dateRangeFilters = [],
    defaultVisibleFilterCount = 6,
    facetedFilters = [],
    labels,
    numberRangeFilters = [],
    onValuesChange,
    textFilters = [],
    values,
  } = props
  const [expanded, setExpanded] = useState(false)
  const filters = useMemo(
    () => [
      ...textFilters.map((config) => ({ config, kind: 'text' as const })),
      ...numberRangeFilters.map((config) => ({
        config,
        kind: 'number' as const,
      })),
      ...dateRangeFilters.map((config) => ({ config, kind: 'date' as const })),
      ...facetedFilters.map((config) => ({ config, kind: 'faceted' as const })),
    ],
    [dateRangeFilters, facetedFilters, numberRangeFilters, textFilters]
  )
  const visibleFilters = expanded
    ? filters
    : filters.slice(0, defaultVisibleFilterCount)
  const hasMore = filters.length > defaultVisibleFilterCount
  const isFiltered = Object.values(values).some(hasFilterValue)
  const setValue = (id: string, value: TableFilterValue) => {
    onValuesChange((previous) => {
      const next = { ...previous }
      if (hasFilterValue(value)) next[id] = value
      else delete next[id]
      return next
    })
  }

  return (
    <section className={cn('space-y-3', className)}>
      <div className='flex flex-wrap items-center gap-2'>
        {visibleFilters.map(({ config, kind }) => {
          if (kind === 'text') {
            const filterValue = values[config.id]

            return (
              <DebouncedFilterInput
                {...config}
                key={config.id}
                onValueChange={setValue}
                value={
                  typeof filterValue === 'string' ? filterValue : undefined
                }
              />
            )
          }
          if (kind === 'number') {
            const fromKey = tableFilterKeys.numberFrom(config.id)
            const toKey = tableFilterKeys.numberTo(config.id)
            return (
              <div
                className={cn('flex gap-2', config.className)}
                key={config.id}
              >
                <Input
                  numberWithComma={config.numberWithComma}
                  onChange={(event) =>
                    setValue(fromKey, event.target.value || undefined)
                  }
                  placeholder={config.fromPlaceholder ?? 'From'}
                  value={
                    typeof values[fromKey] === 'string' ? values[fromKey] : ''
                  }
                />
                <Input
                  numberWithComma={config.numberWithComma}
                  onChange={(event) =>
                    setValue(toKey, event.target.value || undefined)
                  }
                  placeholder={config.toPlaceholder ?? 'To'}
                  value={typeof values[toKey] === 'string' ? values[toKey] : ''}
                />
              </div>
            )
          }
          if (kind === 'date') {
            const fromKey = tableFilterKeys.dateFrom(config.id)
            const toKey = tableFilterKeys.dateTo(config.id)
            return (
              <DateRangePicker
                className={config.className}
                fromPlaceholder={config.fromPlaceholder ?? 'From'}
                key={config.id}
                locale={config.locale}
                mode={config.mode}
                onChange={(range) => {
                  setValue(fromKey, toDateValue(range.from))
                  setValue(toKey, toDateValue(range.to))
                }}
                toPlaceholder={config.toPlaceholder ?? 'To'}
                value={{
                  from: parseDate(values[fromKey]),
                  to: parseDate(values[toKey]),
                }}
              />
            )
          }
          const selected = config.options.filter((option) => {
            const value = values[config.id]
            return Array.isArray(value)
              ? value.includes(option.value)
              : value === option.value
          })
          return config.multiple ? (
            <MultiSelect
              className={config.className}
              clearable
              disabled={config.disabled}
              key={config.id}
              labelKey='label'
              onValueChange={(options) =>
                setValue(
                  config.id,
                  options.map((option) => option.value)
                )
              }
              options={config.options}
              placeholder={config.placeholder ?? config.id}
              searchPlaceholder={config.searchPlaceholder}
              value={selected}
              valueKey='value'
            />
          ) : (
            <Select
              className={config.className}
              clearable
              disabled={config.disabled}
              key={config.id}
              labelKey='label'
              onValueChange={(option) => setValue(config.id, option?.value)}
              options={config.options}
              placeholder={config.placeholder ?? config.id}
              showSearch
              value={selected[0]}
              valueKey='value'
            />
          )
        })}
        {children}
      </div>
      <div className='flex items-center justify-between gap-2'>
        {hasMore ? (
          <Button
            onClick={() => setExpanded((value) => !value)}
            size='sm'
            variant='ghost'
          >
            {expanded
              ? (labels?.collapse ?? 'Show less')
              : (labels?.expand ?? 'Show more')}
          </Button>
        ) : (
          <span />
        )}
        {isFiltered ? (
          <Button
            onClick={() => onValuesChange(() => ({}))}
            size='sm'
            variant='outline'
          >
            {labels?.reset ?? 'Reset filters'}
          </Button>
        ) : null}
      </div>
    </section>
  )
}
