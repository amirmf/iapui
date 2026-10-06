import { type ReactNode, type Ref, useState } from 'react'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command'
import { cn } from './lib/cn'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type ScalarSelectItem = {
  label: string | null | undefined
  value: string | null | undefined
}

export type SearchableSelectProps = {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  'data-form-field'?: string
  id?: string
  name?: string
  onBlur?: () => void
  ref?: Ref<HTMLButtonElement>
  value?: string | null
  selected?: { label: string; value: string } | null
  onChange: (value: string | undefined) => void
  items?: ScalarSelectItem[]
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  onSearch?: (value: string) => void
  shouldFilter?: boolean
  canClear?: boolean
  search?: string
  onOpenChange?: (open: boolean) => void
  className?: string
  showSearch?: boolean
  presentation?: 'default' | 'reference'
  selectText?: string
  loadingText?: ReactNode
  emptyText?: ReactNode
  clearText?: ReactNode
}

export function SearchableSelect(props: SearchableSelectProps) {
  const {
    value,
    onChange,
    items = [],
    placeholder,
    disabled,
    isLoading,
    onSearch,
    shouldFilter = true,
    canClear = true,
    selected,
    search,
    onOpenChange,
    className,
    showSearch = true,
    presentation = 'default',
    selectText = 'Select',
    loadingText = 'Loading…',
    emptyText = 'No results found.',
    clearText = 'Clear',
    ...controlProps
  } = props
  const [open, setOpen] = useState(false)
  const finalSelected = selected ?? items.find((item) => item.value === value)
  const displayLabel = finalSelected?.label ?? placeholder ?? selectText
  const finalValue = finalSelected?.value ?? value

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        onOpenChange?.(next)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          {...controlProps}
          presentation={presentation}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between overflow-hidden', className)}
        >
          <span
            className={cn(
              'min-w-0 flex-1 truncate ltr:text-left rtl:text-right',
              !finalSelected && 'text-muted-foreground'
            )}
            title={displayLabel}
          >
            {displayLabel}
          </span>
          <CaretSortIcon
            aria-hidden='true'
            className='ml-2 h-4 w-4 shrink-0 opacity-50'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        presentation='reference'
        className='w-[var(--radix-popover-trigger-width)] p-0'
        onWheel={(event) => event.stopPropagation()}
      >
        <Command shouldFilter={shouldFilter}>
          {showSearch ? (
            <CommandInput
              placeholder={placeholder}
              className='h-9'
              onValueChange={onSearch}
              value={search}
            />
          ) : null}
          <CommandList className='max-h-60 overflow-auto'>
            {isLoading ? (
              <CommandItem disabled className='flex justify-center'>
                {loadingText}
              </CommandItem>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {items.map((item, index) => (
                    <CommandItem
                      key={`${item.value}-${index}`}
                      value={item.label ?? ''}
                      onSelect={() => {
                        onChange(item.value ?? undefined)
                        setOpen(false)
                      }}
                    >
                      <CheckIcon
                        aria-hidden='true'
                        className={cn(
                          'mr-2 h-4 w-4',
                          item.value === finalValue && 'opacity-100',
                          item.value !== finalValue && 'opacity-0'
                        )}
                      />
                      {item.label ?? ''}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {finalValue && canClear ? (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          onChange(undefined)
                          setOpen(false)
                        }}
                      >
                        {clearText}
                      </CommandItem>
                    </CommandGroup>
                  </>
                ) : null}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
