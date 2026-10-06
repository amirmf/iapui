import { useEffect, useRef, useState } from 'react'

import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ReferenceIcons,
  cn,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import type {
  FacetedTableFilterConfig,
  TableFilterValue,
  TableFilterValues,
} from '@shared/tables/filter/types'

export function ReferenceFacetedFilter(
  props: FacetedTableFilterConfig & {
    onValueChange: (id: string, value: TableFilterValue) => void
    values: TableFilterValues
  }
) {
  const {
    className,
    debounceMs = 1000,
    disabled,
    id,
    multiple = true,
    onValueChange,
    options,
    placeholder = id,
    values,
  } = props
  const { t } = useTranslate()
  const { CheckIcon, PlusCircledIcon } = ReferenceIcons
  const value = values[id]
  const [selectedValues, setSelectedValues] = useState<string[]>(() =>
    Array.isArray(value) ? value : value ? [value] : []
  )
  const pending = useRef<number | undefined>(undefined)
  useEffect(() => {
    setSelectedValues(Array.isArray(value) ? value : value ? [value] : [])
  }, [value])
  useEffect(() => () => window.clearTimeout(pending.current), [])
  const displayedSelection = multiple
    ? selectedValues
    : Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
  const selected = options.filter((option) =>
    displayedSelection.includes(option.value)
  )
  const change = (next: string[]) => {
    setSelectedValues(next)
    window.clearTimeout(pending.current)
    pending.current = window.setTimeout(
      () =>
        onValueChange(
          id,
          multiple ? (next.length ? next : undefined) : next[0]
        ),
      debounceMs
    )
  }
  const clear = () => {
    window.clearTimeout(pending.current)
    setSelectedValues([])
    onValueChange(id, undefined)
  }
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className='h-7 border-dashed px-2'
            disabled={disabled}
            size='sm'
            variant='outline'
          >
            <PlusCircledIcon aria-hidden='true' className='h-4 w-4' />
            {placeholder}
            {selected.length > 0 ? (
              <>
                <span className='mx-2 h-4 w-px bg-border' />
                {!multiple ? (
                  <Badge
                    className='rounded-md px-1 font-normal'
                    variant='secondary'
                  >
                    {selected[0]?.label}
                  </Badge>
                ) : (
                  <>
                    <Badge
                      className='rounded-md px-1 font-normal lg:hidden'
                      variant='secondary'
                    >
                      {selectedValues.length}
                    </Badge>
                    <div className='hidden gap-x-1 lg:flex'>
                      {selectedValues.length > 2 ? (
                        <p className='rounded-md bg-secondary-500 px-1 py-0.5 text-xs font-normal text-white'>
                          {t('dataTable.facetedFilter.multiSelected', {
                            count: selectedValues.length,
                          })}
                        </p>
                      ) : (
                        selected.map((option) => (
                          <p
                            key={option.value}
                            className='max-w-[120px] truncate rounded-md bg-secondary-500 px-1 py-0.5 text-xs font-normal text-white'
                          >
                            {option.label}
                          </p>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          presentation='reference'
          align='start'
          className='w-[200px] p-0'
        >
          <Command>
            <CommandInput
              placeholder={t('dataTable.facetedFilter.searchPlaceholder', {
                title: placeholder,
              })}
            />
            <CommandList>
              <CommandEmpty>
                {t('dataTable.facetedFilter.noResults')}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = displayedSelection.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() =>
                        change(
                          multiple
                            ? isSelected
                              ? selectedValues.filter(
                                  (item) => item !== option.value
                                )
                              : [...selectedValues, option.value]
                            : isSelected
                              ? []
                              : [option.value]
                        )
                      }
                    >
                      <div
                        className={cn(
                          'flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected && 'bg-primary text-primary-foreground',
                          !isSelected && 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon
                          aria-hidden='true'
                          className='size-4 text-white'
                        />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {selectedValues.length ? (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className='justify-center text-center'
                      onSelect={clear}
                    >
                      {t('dataTable.facetedFilter.clear')}
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
