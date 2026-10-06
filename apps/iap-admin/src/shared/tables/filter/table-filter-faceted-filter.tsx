import { useEffect, useRef, useState } from 'react'

import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@iap/ui'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { ReferenceFacetedOptions } from '@shared/tables/filter/reference-faceted-options'
import type {
  FacetedTableFilterConfig,
  TableFilterOption,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'
import { Check, CirclePlus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function FacetedSelectionBadges(props: {
  multiple: boolean
  selected: readonly TableFilterOption[]
  selectedCount: number
  presentation: 'default' | 'reference'
}) {
  const { multiple, selected, selectedCount, presentation } = props
  const { t } = useTranslation()
  if (selectedCount === 0) return null
  return (
    <>
      <span aria-hidden='true' className='mx-2 h-4 w-px bg-border' />
      {!multiple ? (
        <Badge
          presentation={presentation}
          className='rounded-md px-1 font-normal'
          variant='secondary'
        >
          {selected[0]?.label}
        </Badge>
      ) : (
        <>
          <Badge
            presentation={presentation}
            className='rounded-md px-1 font-normal lg:hidden'
            variant='secondary'
          >
            {selectedCount}
          </Badge>
          <span className='hidden gap-x-1 lg:flex'>
            {selectedCount > 2 ? (
              <span className='rounded-md bg-secondary-500 px-1 py-0.5 text-xs font-normal text-white'>
                {t('dataTable.facetedFilter.multiSelected', {
                  count: selectedCount,
                })}
              </span>
            ) : (
              selected.map((option) => (
                <span
                  key={option.value}
                  className='max-w-[120px] truncate rounded-md bg-secondary-500 px-1 py-0.5 text-xs font-normal text-white'
                >
                  {option.label}
                </span>
              ))
            )}
          </span>
        </>
      )}
    </>
  )
}

export function TableFilterFacetedFilter(
  props: FacetedTableFilterConfig & {
    onValueChange: (id: string, value: string | string[] | undefined) => void
    values: TableFilterValues
    presentation?: 'default' | 'reference'
  }
) {
  const {
    className,
    presentation = 'default',
    deferSingleSelection = false,
    debounceMs = presentation === 'reference' ? 1000 : 0,
    disabled,
    id,
    multiple = true,
    onValueChange,
    options,
    placeholder = id,
    searchPlaceholder,
    values,
  } = props
  const { t } = useTranslation()
  const externalValue = values[id]
  const signature = JSON.stringify(externalValue ?? null)
  const [localValue, setLocalValue] = useState(externalValue)
  const [search, setSearch] = useState('')
  const pending = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    clearTimeout(pending.current)
    setLocalValue(JSON.parse(signature) ?? undefined)
  }, [id, signature])
  useEffect(() => () => clearTimeout(pending.current), [])
  const change = (next: TableFilterValue, immediate = false) => {
    setLocalValue(next)
    clearTimeout(pending.current)
    if (debounceMs > 0 && !immediate)
      pending.current = setTimeout(() => onValueChange(id, next), debounceMs)
    else onValueChange(id, next)
  }
  const selectedValues = Array.isArray(localValue)
    ? localValue
    : localValue
      ? [localValue]
      : []
  const displayedValues =
    deferSingleSelection && !multiple
      ? Array.isArray(externalValue)
        ? externalValue
        : externalValue
          ? [externalValue]
          : []
      : selectedValues
  const selected = options.filter((option) =>
    displayedValues.includes(option.value)
  )
  const visibleOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )
  const searchLabel =
    searchPlaceholder ??
    t('dataTable.facetedFilter.searchPlaceholder', { title: placeholder })

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            presentation={presentation}
            className='h-7 border-dashed px-2 focus-visible:ring-2 focus-visible:ring-ring'
            disabled={disabled}
            size='sm'
            variant='outline'
          >
            {presentation === 'reference' ? (
              <PlusCircledIcon aria-hidden='true' className='size-4' />
            ) : (
              <CirclePlus aria-hidden='true' className='size-4' />
            )}
            {placeholder}
            <FacetedSelectionBadges
              presentation={presentation}
              multiple={multiple}
              selected={selected}
              selectedCount={displayedValues.length}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          presentation={presentation}
          align='start'
          className='w-[200px] p-0'
        >
          {presentation === 'reference' ? (
            <ReferenceFacetedOptions
              clearLabel={t('dataTable.facetedFilter.clear')}
              emptyLabel={t('dataTable.facetedFilter.noResults')}
              searchLabel={searchLabel}
              options={options}
              selectedValues={displayedValues}
              onClear={() => change(undefined, true)}
              onSelect={(option) => {
                const isSelected = displayedValues.includes(option.value)
                const next = multiple
                  ? isSelected
                    ? selectedValues.filter((value) => value !== option.value)
                    : [...selectedValues, option.value]
                  : isSelected
                    ? []
                    : [option.value]
                change(next.length ? (multiple ? next : next[0]) : undefined)
              }}
            />
          ) : (
            <>
              <div className='flex items-center border-b px-3'>
                <Search
                  aria-hidden='true'
                  className='me-2 size-4 shrink-0 opacity-50'
                />
                <Input
                  aria-label={searchLabel}
                  className='border-0 px-0 shadow-none'
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={searchLabel}
                  value={search}
                />
              </div>
              <div className='max-h-[300px] overflow-y-auto overflow-x-hidden p-1'>
                {visibleOptions.length === 0 ? (
                  <p className='py-4 text-center text-sm'>
                    {t('dataTable.facetedFilter.noResults')}
                  </p>
                ) : null}
                <div aria-label={placeholder} role='group'>
                  {visibleOptions.map((option) => {
                    const isSelected = displayedValues.includes(option.value)
                    return (
                      <Button
                        key={option.value}
                        aria-pressed={isSelected}
                        className='h-auto w-full justify-start rounded-sm px-2 py-1.5 font-normal focus-visible:bg-accent'
                        onClick={() => {
                          const next = multiple
                            ? isSelected
                              ? selectedValues.filter(
                                  (value) => value !== option.value
                                )
                              : [...selectedValues, option.value]
                            : isSelected
                              ? []
                              : [option.value]
                          change(
                            next.length
                              ? multiple
                                ? next
                                : next[0]
                              : undefined
                          )
                        }}
                        variant='ghost'
                      >
                        <span
                          className={cn(
                            'flex size-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <Check
                            aria-hidden='true'
                            className='size-4 text-white'
                          />
                        </span>
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
                {selectedValues.length > 0 ? (
                  <div className='mt-1 border-t pt-1'>
                    <Button
                      className='h-auto w-full rounded-sm px-2 py-1.5 font-normal focus-visible:bg-accent'
                      onClick={() => change(undefined, true)}
                      variant='ghost'
                    >
                      {t('dataTable.facetedFilter.clear')}
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
