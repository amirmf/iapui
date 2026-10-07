import { useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@iap/ui'
import { Check, ChevronDown } from 'lucide-react'

const headingLevels = [1, 2, 3, 4, 5, 6] as const
const headingOptions = [
  { label: 'P', value: 'paragraph' },
  ...headingLevels.map((level) => ({
    label: `H${level}`,
    value: `heading-${level}`,
  })),
]

type MarkdownEditorHeadingMenuProps = {
  value: string
  disabled: boolean
  label: string
  onValueChange: (value: string) => void
}

export function MarkdownEditorHeadingMenu({
  value,
  disabled,
  label,
  onValueChange,
}: MarkdownEditorHeadingMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeOption = headingOptions.find((option) => option.value === value)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          disabled={disabled}
          dir='ltr'
          className='h-8 w-14 max-w-14 justify-between px-1.5 font-mono text-xs'
          aria-label={label}
          aria-expanded={isOpen}
        >
          {activeOption?.label}
          <ChevronDown className='size-3.5 shrink-0 opacity-60' aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-20 max-w-[calc(100vw-2rem)] p-1'
      >
        <div dir='ltr' aria-label={label} className='grid gap-0.5'>
          {headingOptions.map((option) => {
            const isActive = option.value === value
            return (
              <Button
                key={option.value}
                type='button'
                variant='ghost'
                aria-pressed={isActive}
                onClick={() => {
                  onValueChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'h-8 w-full justify-between px-1.5 font-mono text-xs',
                  isActive && 'bg-accent text-accent-foreground'
                )}
              >
                {option.label}
                {isActive ? <Check className='size-3.5' aria-hidden /> : null}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
