'use client'

import type { ReactNode, Ref } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { Command } from 'cmdk'

import { cn } from './lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type SelectOption = Record<string, unknown>

type SelectTriggerProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'aria-labelledby'?: string
  'data-form-field'?: string
  id?: string
  name?: string
  onBlur?: () => void
  ref?: Ref<HTMLButtonElement>
}

export type SelectProps<TOption extends SelectOption> = SelectTriggerProps & {
  className?: string
  clearable?: boolean
  contentClassName?: string
  defaultValue?: TOption
  disabled?: boolean
  emptyText?: ReactNode
  getOptionDisabled?: (option: TOption) => boolean
  labelKey: string
  onValueChange?: (value: TOption | undefined) => void
  options: readonly TOption[]
  placeholder?: ReactNode
  showSearch?: boolean
  searchKey?: string
  searchPlaceholder?: string
  triggerClassName?: string
  value?: TOption
  valueKey: string
}

export const selectedOptionClassName =
  'data-[checked=true]:bg-primary-subtle data-[checked=true]:text-primary'

function getOptionProperty<TOption extends SelectOption>(
  option: TOption,
  key: string
) {
  return key.split('.').reduce<unknown>((value, keyPart) => {
    if (value === null || value === undefined || typeof value !== 'object') {
      return undefined
    }

    return (value as Record<string, unknown>)[keyPart]
  }, option)
}

function getOptionString<TOption extends SelectOption>(
  option: TOption,
  key: string
) {
  const value = getOptionProperty(option, key)

  return value === null || value === undefined ? '' : String(value)
}

function getOptionLabel<TOption extends SelectOption>(
  option: TOption,
  key: string
) {
  return getOptionProperty(option, key) as ReactNode
}

function isSameOption<TOption extends SelectOption>(
  option: TOption,
  selectedOption: TOption | undefined,
  valueKey: string
) {
  return selectedOption
    ? Object.is(
        getOptionProperty(option, valueKey),
        getOptionProperty(selectedOption, valueKey)
      )
    : false
}

export function Select<TOption extends SelectOption>(
  props: SelectProps<TOption>
) {
  const {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    className,
    clearable = false,
    contentClassName,
    defaultValue,
    'data-form-field': dataFormField,
    disabled = false,
    emptyText = 'No results found.',
    getOptionDisabled,
    id,
    labelKey,
    name,
    onBlur,
    onValueChange,
    options,
    placeholder = 'Select an option',
    ref,
    searchKey = labelKey,
    searchPlaceholder = 'Search…',
    showSearch = false,
    triggerClassName,
    value,
    valueKey,
  } = props
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<TOption | undefined>(
    defaultValue
  )
  const isControlled = 'value' in props
  const selectedValue = isControlled ? value : internalValue
  const selectedOption = useMemo(
    () =>
      options.find((option) => isSameOption(option, selectedValue, valueKey)),
    [options, selectedValue, valueKey]
  )
  const hasValue = selectedOption !== undefined

  useEffect(() => {
    if (selectedOption && getOptionDisabled?.(selectedOption)) {
      setOpen(false)
    }
  }, [getOptionDisabled, selectedOption])

  const updateValue = (nextValue: TOption | undefined) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
  }

  return (
    <Popover
      onOpenChange={(nextOpen) => !disabled && setOpen(nextOpen)}
      open={open}
    >
      <div className={cn('relative w-full', className)}>
        <PopoverTrigger asChild>
          <button
            aria-describedby={ariaDescribedBy}
            aria-expanded={open}
            aria-invalid={ariaInvalid}
            aria-labelledby={ariaLabelledBy}
            aria-label={
              typeof placeholder === 'string' ? placeholder : undefined
            }
            className={cn(
              'border-input bg-surface text-foreground focus-visible:ring-ring focus-visible:ring-offset-background aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30 aria-[invalid=true]:focus-visible:ring-destructive hover:bg-surface-muted flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-start text-sm shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:ring-2',
              !hasValue && 'text-muted-foreground',
              clearable && hasValue && 'ps-10',
              triggerClassName
            )}
            disabled={disabled}
            data-form-field={dataFormField}
            id={id}
            name={name}
            onBlur={onBlur}
            ref={ref}
            role='combobox'
            type='button'
          >
            <span className='min-w-0 flex-1 truncate'>
              {selectedOption
                ? getOptionLabel(selectedOption, labelKey)
                : placeholder}
            </span>
            <span aria-hidden='true' className='text-muted-foreground shrink-0'>
              ▾
            </span>
          </button>
        </PopoverTrigger>
        {clearable && hasValue ? (
          <button
            aria-label='Clear selection'
            className='text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-ring absolute start-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md outline-none focus-visible:ring-2'
            disabled={disabled}
            onClick={() => updateValue(undefined)}
            type='button'
          >
            <span aria-hidden='true'>×</span>
          </button>
        ) : null}
      </div>
      <PopoverContent
        align='start'
        className={cn(
          'w-[var(--radix-popover-trigger-width)] p-0',
          contentClassName
        )}
      >
        <Command className='overflow-hidden rounded-xl' label='Options'>
          {showSearch ? (
            <div className='border-border border-b p-2'>
              <Command.Input
                autoFocus
                className='bg-surface text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md px-3 text-sm outline-none focus-visible:ring-2'
                placeholder={searchPlaceholder}
              />
            </div>
          ) : null}
          <Command.List className='max-h-64 overflow-y-auto p-1'>
            <Command.Empty className='text-muted-foreground px-3 py-6 text-center text-sm'>
              {emptyText}
            </Command.Empty>
            {options.map((option) => {
              const selected = isSameOption(option, selectedValue, valueKey)
              const optionDisabled = getOptionDisabled?.(option) ?? false

              return (
                <Command.Item
                  className={cn(
                    'text-foreground data-[selected=true]:bg-surface-muted flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[disabled=true]:opacity-50',
                    selectedOptionClassName
                  )}
                  data-checked={selected}
                  disabled={optionDisabled}
                  key={getOptionString(option, valueKey)}
                  onSelect={() => {
                    if (optionDisabled || disabled) return
                    updateValue(option)
                    setOpen(false)
                  }}
                  value={`${getOptionString(option, searchKey)} ${getOptionString(option, valueKey)}`}
                >
                  <span
                    aria-hidden='true'
                    className={cn(
                      'size-4 shrink-0 text-center',
                      selected ? 'opacity-100' : 'opacity-0'
                    )}
                  >
                    ✓
                  </span>
                  <span className='min-w-0 flex-1 truncate'>
                    {getOptionLabel(option, labelKey)}
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

export { getOptionProperty, getOptionString, isSameOption }
