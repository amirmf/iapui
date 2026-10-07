import { useEffect, useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@iap/ui'
import { Check, ChevronDown } from 'lucide-react'

import { markdownEditorFontSizes } from './markdown-editor-font-size'

type MarkdownEditorFontSizeMenuProps = {
  disabled: boolean
  label: string
  value: string
  onValueChange: (value: string) => void
}

export function MarkdownEditorFontSizeMenu({
  disabled,
  label,
  value,
  onValueChange,
}: MarkdownEditorFontSizeMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (disabled) setIsOpen(false)
  }, [disabled])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          disabled={disabled}
          dir='ltr'
          className='h-8 w-20 max-w-20 justify-between px-2 font-mono text-xs'
          aria-label={label}
          aria-expanded={isOpen}
        >
          {value}
          <ChevronDown className='size-3.5 shrink-0 opacity-60' aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-28 max-w-[calc(100vw-2rem)] p-1'
      >
        <div dir='ltr' aria-label={label} className='grid gap-0.5'>
          {markdownEditorFontSizes.map((fontSize) => {
            const isActive = fontSize === value
            return (
              <Button
                key={fontSize}
                type='button'
                variant='ghost'
                aria-pressed={isActive}
                onClick={() => {
                  if (disabled) return
                  onValueChange(fontSize)
                  setIsOpen(false)
                }}
                className={cn(
                  'h-8 w-full justify-between px-1.5 font-mono text-xs',
                  isActive && 'bg-accent text-accent-foreground'
                )}
              >
                {fontSize}
                {isActive ? <Check className='size-3.5' aria-hidden /> : null}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
