'use client'

import type { ReactNode, Ref } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'

import { buttonVariants } from './button'
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
  /** Render a localized clear command in the popup instead of the icon button. */
  clearLabel?: string
  contentClassName?: string
  defaultValue?: TOption
  disabled?: boolean
  emptyText?: ReactNode
  getOptionDisabled?: (option: TOption) => boolean
  isLoading?: boolean
  labelKey: string
  loadingText?: ReactNode
  onValueChange?: (value: TOption | undefined) => void
  onSearch?: (value: string) => void
  options: readonly TOption[]
  placeholder?: ReactNode
  showSearch?: boolean
  shouldFilter?: boolean
  searchKey?: string
  searchPlaceholder?: string
  triggerClassName?: string
  value?: TOption
  valueKey: string
  presentation?: 'default' | 'reference'
  /** Retains the source scalar for clearing when it is absent from search results. */
  selectedValue?: string
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
    clearLabel,
    contentClassName,
    defaultValue,
    'data-form-field': dataFormField,
    disabled = false,
    emptyText = 'No results found.',
    getOptionDisabled,
    id,
    isLoading = false,
    labelKey,
    loadingText = 'Loading…',
    name,
    onBlur,
    onSearch,
    onValueChange,
    options,
    placeholder = 'Select an option',
    ref,
    searchKey = labelKey,
    searchPlaceholder = 'Search…',
    showSearch = false,
    shouldFilter = true,
    triggerClassName,
    value,
    valueKey,
    presentation = 'default',
    selectedValue: selectedScalar,
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
  const isReference = presentation === 'reference'
  const hasValue =
    selectedOption !== undefined || (isReference && !!selectedScalar)

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
              !selectedOption && 'text-muted-foreground',
              clearable && hasValue && !clearLabel && 'ps-10',
              isReference &&
                buttonVariants({
                  variant: 'outline',
                  className:
                    'min-h-0 w-full justify-between overflow-hidden rounded-md focus-visible:ring-0',
                }),
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
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                isReference && 'ltr:text-left rtl:text-right'
              )}
              title={
                isReference
                  ? String(
                      selectedOption
                        ? getOptionLabel(selectedOption, labelKey)
                        : (placeholder ?? '')
                    )
                  : undefined
              }
            >
              {selectedOption
                ? getOptionLabel(selectedOption, labelKey)
                : placeholder}
            </span>
            <span aria-hidden='true' className='text-muted-foreground shrink-0'>
              {isReference ? (
                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              ) : (
                '▾'
              )}
            </span>
          </button>
        </PopoverTrigger>
        {clearable && hasValue && !clearLabel && !isReference ? (
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
        onWheel={(event) => {
          event.stopPropagation()
        }}
      >
        <Command
          className={cn(
            'overflow-hidden rounded-xl',
            isReference && 'rounded-md'
          )}
          label='Options'
          shouldFilter={shouldFilter}
        >
          {showSearch ? (
            <div
              className={cn(
                'border-border border-b p-2',
                isReference && 'flex h-9 items-center gap-2 px-3 py-0'
              )}
            >
              {isReference ? (
                <Search
                  aria-hidden='true'
                  className='size-4 shrink-0 opacity-50'
                />
              ) : null}
              <Command.Input
                autoFocus
                className={cn(
                  'bg-surface text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md px-3 text-sm outline-none focus-visible:ring-2',
                  isReference &&
                    'h-9 rounded-none bg-transparent px-0 focus-visible:ring-0'
                )}
                onValueChange={onSearch}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : null}
          <Command.List
            className={cn(
              'max-h-64 overflow-y-auto p-1',
              isReference && 'max-h-60 overflow-auto p-0'
            )}
          >
            {isLoading ? (
              <p
                className={cn(
                  'text-muted-foreground px-3 py-6 text-center text-sm',
                  isReference && 'p-1 py-1.5'
                )}
              >
                {loadingText}
              </p>
            ) : (
              <Command.Empty
                className={cn(
                  'text-muted-foreground px-3 py-6 text-center text-sm',
                  isReference && 'py-4'
                )}
              >
                {emptyText}
              </Command.Empty>
            )}
            <Command.Group
              className={cn(
                isReference ? 'text-foreground overflow-hidden p-1' : 'contents'
              )}
            >
              {(!isLoading ? options : []).map((option) => {
                const selected = isSameOption(option, selectedValue, valueKey)
                const optionDisabled = getOptionDisabled?.(option) ?? false

                return (
                  <Command.Item
                    className={cn(
                      'text-foreground data-[selected=true]:bg-surface-muted flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[disabled=true]:opacity-50',
                      !isReference && selectedOptionClassName,
                      isReference &&
                        'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground min-h-0 cursor-default rounded-sm px-2 py-1.5 select-none'
                    )}
                    data-checked={selected}
                    disabled={optionDisabled}
                    key={getOptionString(option, valueKey)}
                    onSelect={() => {
                      if (optionDisabled || disabled) return
                      updateValue(option)
                      setOpen(false)
                    }}
                    value={
                      isReference
                        ? getOptionString(option, labelKey)
                        : `${getOptionString(option, searchKey)} ${getOptionString(option, valueKey)}`
                    }
                  >
                    <span
                      aria-hidden='true'
                      className={cn(
                        'size-4 shrink-0 text-center',
                        selected ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      {isReference ? (
                        <CheckIcon className='mr-2 h-4 w-4' />
                      ) : (
                        '✓'
                      )}
                    </span>
                    <span
                      className={cn(
                        'min-w-0 flex-1',
                        !isReference && 'truncate'
                      )}
                    >
                      {getOptionLabel(option, labelKey)}
                    </span>
                  </Command.Item>
                )
              })}
            </Command.Group>
            {!isLoading && clearable && hasValue && clearLabel ? (
              <>
                <Command.Separator className='border-border my-1 border-t' />
                <Command.Item
                  className={cn(
                    'text-foreground data-[selected=true]:bg-surface-muted flex min-h-11 cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none',
                    isReference &&
                      'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground min-h-0 rounded-sm px-2 py-1.5'
                  )}
                  onSelect={() => {
                    if (disabled) return
                    updateValue(undefined)
                    setOpen(false)
                  }}
                  value={clearLabel}
                >
                  {clearLabel}
                </Command.Item>
              </>
            ) : null}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { getOptionProperty, getOptionString, isSameOption }
