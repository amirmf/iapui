'use client'

import type { ReactNode, Ref } from 'react'
import { useMemo, useState } from 'react'

import { Command } from 'cmdk'

import { cn } from './lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { type SelectOption, getOptionProperty, getOptionString } from './select'

type MultiSelectTriggerProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-labelledby'?: string
  'data-form-field'?: string
  id?: string
  name?: string
  onBlur?: () => void
  ref?: Ref<HTMLDivElement>
}

export type MultiSelectProps<TOption extends SelectOption> =
  MultiSelectTriggerProps & {
    className?: string
    clearable?: boolean
    closeOnSelect?: boolean
    contentClassName?: string
    defaultValue?: readonly TOption[]
    disabled?: boolean
    emptyText?: ReactNode
    getOptionDisabled?: (option: TOption) => boolean
    labelKey: string
    maxVisibleItems?: number
    onValueChange?: (value: TOption[]) => void
    options: readonly TOption[]
    placeholder?: ReactNode
    searchKey?: string
    searchPlaceholder?: string
    triggerClassName?: string
    value?: readonly TOption[]
    valueKey: string
  }

function uniqueOptions<TOption extends SelectOption>(
  options: readonly TOption[],
  valueKey: string
) {
  const values = new Set<unknown>()
  return options.filter((option) => {
    const value = getOptionProperty(option, valueKey)
    if (values.has(value)) return false
    values.add(value)
    return true
  })
}

export function MultiSelect<TOption extends SelectOption>(
  props: MultiSelectProps<TOption>
) {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    className,
    clearable = false,
    closeOnSelect = false,
    contentClassName,
    defaultValue = [],
    'data-form-field': dataFormField,
    disabled = false,
    emptyText = 'No results found.',
    getOptionDisabled,
    id,
    labelKey,
    maxVisibleItems = 3,
    name,
    onBlur,
    onValueChange,
    options,
    placeholder = 'Select options',
    ref,
    searchKey = labelKey,
    searchPlaceholder = 'Search…',
    triggerClassName,
    value,
    valueKey,
  } = props
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<TOption[]>(() =>
    uniqueOptions(defaultValue, valueKey)
  )
  const isControlled = 'value' in props
  const selectedValues = useMemo(
    () => uniqueOptions(isControlled ? (value ?? []) : internalValue, valueKey),
    [internalValue, isControlled, value, valueKey]
  )
  const selectedValueSet = useMemo(
    () =>
      new Set(
        selectedValues.map((option) => getOptionProperty(option, valueKey))
      ),
    [selectedValues, valueKey]
  )
  const selectedOptions = useMemo(
    () =>
      options.filter((option) =>
        selectedValueSet.has(getOptionProperty(option, valueKey))
      ),
    [options, selectedValueSet, valueKey]
  )
  const visibleOptions = selectedOptions.slice(0, Math.max(0, maxVisibleItems))
  const overflowCount = Math.max(
    selectedOptions.length - visibleOptions.length,
    0
  )

  const updateValue = (nextValue: readonly TOption[]) => {
    const uniqueValue = uniqueOptions(nextValue, valueKey)
    if (!isControlled) setInternalValue(uniqueValue)
    onValueChange?.(uniqueValue)
  }

  const toggleOption = (option: TOption) => {
    if (disabled || getOptionDisabled?.(option)) return
    const optionValue = getOptionProperty(option, valueKey)
    const isSelected = selectedValueSet.has(optionValue)
    updateValue(
      isSelected
        ? selectedValues.filter(
            (selectedOption) =>
              !Object.is(
                getOptionProperty(selectedOption, valueKey),
                optionValue
              )
          )
        : [...selectedValues, option]
    )
    if (closeOnSelect) setOpen(false)
  }

  const hasValue = selectedOptions.length > 0

  return (
    <Popover
      onOpenChange={(nextOpen) => !disabled && setOpen(nextOpen)}
      open={open}
    >
      <PopoverTrigger asChild>
        <div
          aria-describedby={ariaDescribedBy}
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-labelledby={ariaLabelledBy}
          aria-label={
            hasValue
              ? `${selectedOptions.length} options selected. Open selection list.`
              : typeof placeholder === 'string'
                ? placeholder
                : 'Open selection list'
          }
          className={cn(
            'border-input bg-surface text-foreground focus-visible:ring-ring focus-visible:ring-offset-background aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive hover:bg-surface-muted flex min-h-11 w-full cursor-pointer items-center gap-1 rounded-lg border p-1.5 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 aria-[invalid=true]:ring-2',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          data-field-name={name}
          data-form-field={dataFormField}
          id={id}
          onBlur={onBlur}
          ref={ref}
          role='combobox'
          tabIndex={disabled ? -1 : 0}
        >
          <div className='flex min-w-0 flex-1 flex-wrap items-center gap-1'>
            {hasValue ? (
              <>
                {visibleOptions.map((option) => (
                  <button
                    aria-label={`Remove ${getOptionString(option, labelKey)}`}
                    className='bg-primary-subtle text-primary focus-visible:ring-ring inline-flex max-w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-medium outline-none focus-visible:ring-2'
                    disabled={disabled || getOptionDisabled?.(option)}
                    key={getOptionString(option, valueKey)}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleOption(option)
                    }}
                    type='button'
                  >
                    <span className='min-w-0 truncate'>
                      {getOptionProperty(option, labelKey) as ReactNode}
                    </span>
                    <span aria-hidden='true' className='shrink-0'>
                      ×
                    </span>
                  </button>
                ))}
                {overflowCount > 0 ? (
                  <span className='bg-surface-muted text-muted-foreground inline-flex rounded-md px-2 py-1 text-xs font-medium'>
                    +{overflowCount}
                  </span>
                ) : null}
              </>
            ) : (
              <span className='text-muted-foreground min-w-0 flex-1 truncate px-1.5 text-sm'>
                {placeholder}
              </span>
            )}
          </div>
          {clearable && hasValue ? (
            <button
              aria-label='Clear selections'
              className='text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring inline-flex size-9 shrink-0 items-center justify-center rounded-md outline-none focus-visible:ring-2'
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation()
                updateValue([])
              }}
              type='button'
            >
              <span aria-hidden='true'>×</span>
            </button>
          ) : null}
          <span
            aria-hidden='true'
            className={cn(
              'inline-flex size-9 shrink-0 items-center justify-center',
              triggerClassName
            )}
          >
            <span aria-hidden='true' className='text-muted-foreground'>
              ▾
            </span>
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className={cn(
          'w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0',
          contentClassName
        )}
      >
        <Command className='overflow-hidden rounded-xl' label='Options'>
          <div className='border-border border-b p-2'>
            <Command.Input
              autoFocus
              className='bg-surface text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md px-3 text-sm outline-none focus-visible:ring-2'
              placeholder={searchPlaceholder}
            />
          </div>
          <Command.List className='max-h-64 overflow-y-auto p-1'>
            <Command.Empty className='text-muted-foreground px-3 py-6 text-center text-sm'>
              {emptyText}
            </Command.Empty>
            {options.map((option) => {
              const selected = selectedValueSet.has(
                getOptionProperty(option, valueKey)
              )
              const optionDisabled = getOptionDisabled?.(option) ?? false

              return (
                <Command.Item
                  className='text-foreground data-[selected=true]:bg-surface-muted data-[checked=true]:bg-primary-subtle data-[checked=true]:text-primary flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[disabled=true]:opacity-50'
                  data-checked={selected}
                  disabled={optionDisabled}
                  key={getOptionString(option, valueKey)}
                  onSelect={() => toggleOption(option)}
                  value={`${getOptionString(option, searchKey)} ${getOptionString(option, valueKey)}`}
                >
                  <span
                    className={cn(
                      'border-input flex size-4 shrink-0 items-center justify-center rounded border',
                      selected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-surface'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={cn('text-xs', !selected && 'opacity-0')}
                    >
                      ✓
                    </span>
                  </span>
                  <span className='min-w-0 flex-1 truncate'>
                    {getOptionProperty(option, labelKey) as ReactNode}
                  </span>
                </Command.Item>
              )
            })}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
