import { Command, cn } from '@iap/ui'
import { CheckIcon } from '@radix-ui/react-icons'
import type { TableFilterOption } from '@shared/tables/filter/types'
import { Search } from 'lucide-react'

export function ReferenceFacetedOptions(props: {
  clearLabel: string
  emptyLabel: string
  onClear: () => void
  onSelect: (option: TableFilterOption) => void
  options: readonly TableFilterOption[]
  searchLabel: string
  selectedValues: readonly string[]
}) {
  const {
    clearLabel,
    emptyLabel,
    onClear,
    onSelect,
    options,
    searchLabel,
    selectedValues,
  } = props
  const itemClassName =
    'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50'
  return (
    <Command className='flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'>
      <div className='flex h-9 items-center gap-2 border-b px-3'>
        <Search aria-hidden='true' className='size-4 shrink-0 opacity-50' />
        <Command.Input
          aria-label={searchLabel}
          className='flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
          placeholder={searchLabel}
        />
      </div>
      <Command.List className='max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden'>
        <Command.Empty className='py-4 text-center text-sm'>
          {emptyLabel}
        </Command.Empty>
        <Command.Group className='overflow-hidden p-1 text-foreground'>
          {options.map((option) => (
            <Command.Item
              className={itemClassName}
              key={option.value}
              onSelect={() => onSelect(option)}
              value={option.label}
            >
              <span
                className={cn(
                  'flex size-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.includes(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible'
                )}
              >
                <CheckIcon aria-hidden='true' className='size-4 text-white' />
              </span>
              <span>{option.label}</span>
            </Command.Item>
          ))}
        </Command.Group>
        {selectedValues.length ? (
          <>
            <Command.Separator className='-mx-1 h-px bg-border' />
            <Command.Group className='overflow-hidden p-1 text-foreground'>
              <Command.Item
                className={cn(itemClassName, 'justify-center text-center')}
                onSelect={onClear}
              >
                {clearLabel}
              </Command.Item>
            </Command.Group>
          </>
        ) : null}
      </Command.List>
    </Command>
  )
}
