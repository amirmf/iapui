import * as React from 'react'

import { cn } from '@iap/ui'
import { Badge } from '@iap/ui'
import { Button } from '@iap/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@iap/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@iap/ui'
import { ReferenceIcons } from '@iap/ui'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Item {
  label: string
  value: string
}

interface MultiSelectProps {
  ['aria-label']?: string
  value?: string[]
  onChange?: (value: string[]) => void
  onSelect?: (value: string) => void
  items?: Item[]
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  hasRemoveAll?: boolean
  hasSelectAll?: boolean
  onSearch?: (value: string) => void
  search?: string
  shouldFilter?: boolean
  selected?: { label: string; value: string }[] | null
}

export function MultiSelect(props: MultiSelectProps) {
  const {
    value = [],
    onChange,
    items = [],
    placeholder,
    disabled,
    isLoading,
    onSelect,
    hasRemoveAll = true,
    hasSelectAll = true,
    onSearch,
    search,
    shouldFilter = true,
    selected,
  } = props
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const defaultPlaceholder =
    placeholder ?? t('common.selectItems', 'Select items')
  const selectedItems =
    selected ?? items.filter((item) => value.includes(item.value))
  const finalValue = selected?.map((item) => item.value) ?? value

  const handleSelect = (itemValue: string) => {
    const newValue = finalValue.includes(itemValue)
      ? finalValue.filter((v) => v !== itemValue)
      : [...finalValue, itemValue]
    onSelect?.(itemValue)
    onChange?.(newValue)
  }

  const handleRemove = (itemValue: string) => {
    onChange?.(finalValue.filter((v) => v !== itemValue))
    onSelect?.(itemValue)
  }

  // Add handlers for select all / clear all
  const handleSelectAll = () => {
    const allValues = items.map((i) => i.value)
    onChange?.(allValues)
  }

  const handleClearAll = () => {
    onChange?.([])
  }

  const ariaLabel = props['aria-label']

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          presentation='reference'
          variant='outline'
          role='combobox'
          disabled={disabled}
          aria-label={ariaLabel}
          className='h-auto min-h-8 w-full justify-between'
        >
          <div className='flex flex-1 flex-wrap gap-1'>
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <Badge
                  presentation='reference'
                  key={item.value}
                  variant='secondary'
                  className='mb-1 mr-1'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item.value)
                  }}
                >
                  <span className='line-clamp-1 max-w-32 whitespace-pre-wrap'>
                    {item.label}
                  </span>
                  <X className='ml-1 h-3 w-3' />
                </Badge>
              ))
            ) : (
              <span className='text-sm text-muted-foreground'>
                {defaultPlaceholder}
              </span>
            )}
          </div>
          <ReferenceIcons.CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        presentation='reference'
        className='w-[var(--radix-popover-trigger-width)] p-0'
        onWheel={(e) => {
          e.stopPropagation()
        }}
      >
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            onValueChange={onSearch}
            value={search}
            placeholder={defaultPlaceholder}
            className='h-9'
          />
          <CommandList className='max-h-60 overflow-auto'>
            {isLoading ? (
              <CommandItem disabled>
                {t('common.loading', 'Loading...')}
              </CommandItem>
            ) : (
              <>
                <CommandEmpty>
                  {t('common.noResultsFound', 'No results found.')}
                </CommandEmpty>

                {/* Add 'Select all' and 'Clear all' command items */}
                <CommandGroup className='border-b'>
                  {hasSelectAll && (
                    <CommandItem
                      value={t('common.selectAll')}
                      onSelect={() => handleSelectAll()}
                      disabled={disabled || items.length === 0}
                    >
                      {t('common.selectAll')}
                    </CommandItem>
                  )}
                  {hasRemoveAll && (
                    <CommandItem
                      value={t('common.clearAll')}
                      onSelect={() => handleClearAll()}
                      disabled={disabled || value.length === 0}
                    >
                      {t('common.clearAll')}
                    </CommandItem>
                  )}
                </CommandGroup>

                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      onSelect={() => handleSelect(item.value)}
                    >
                      <ReferenceIcons.CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          finalValue.includes(item.value) && 'opacity-100',
                          !finalValue.includes(item.value) && 'opacity-0'
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
