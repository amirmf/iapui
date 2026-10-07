import { useEffect, useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger } from '@iap/ui'
import { type LucideIcon } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { useTranslation } from 'react-i18next'

const colorPresets = [
  { color: '#2563eb', labelKey: 'common.markdownEditor.colorPrimary' },
  { color: '#0d9488', labelKey: 'common.markdownEditor.colorSecondary' },
  { color: '#22c55e', labelKey: 'common.markdownEditor.colorSuccess' },
  { color: '#dc2626', labelKey: 'common.markdownEditor.colorError' },
  { color: '#252b37', labelKey: 'common.markdownEditor.colorTextDefault' },
]

type MarkdownEditorColorMenuProps = {
  disabled: boolean
  label: string
  applyLabel: string
  clearLabel: string
  icon: LucideIcon
  onClear: () => void
  onSelect: (color: string) => void
}

export function MarkdownEditorColorMenu({
  disabled,
  label,
  applyLabel,
  clearLabel,
  icon: Icon,
  onClear,
  onSelect,
}: MarkdownEditorColorMenuProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [color, setColor] = useState('#1d4ed8')
  useEffect(() => {
    if (disabled) setIsOpen(false)
  }, [disabled])
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8 p-0'
          disabled={disabled}
          aria-label={label}
          aria-expanded={isOpen}
        >
          <Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-38 p-2'>
        <div className='mb-2 grid grid-cols-5 gap-1.5'>
          {colorPresets.map((preset) => (
            <Button
              key={preset.color}
              type='button'
              variant='outline'
              size='icon'
              className='size-7 border-border p-0'
              style={{ backgroundColor: preset.color }}
              aria-label={t(preset.labelKey as never)}
              aria-pressed={color === preset.color}
              disabled={disabled}
              onClick={() => setColor(preset.color)}
            />
          ))}
        </div>
        <HexColorPicker
          className='!w-full'
          color={color}
          onChange={setColor}
          aria-label={label}
        />
        <div className='mt-2 flex gap-2'>
          <Button
            type='button'
            size='sm'
            className='flex-1'
            onClick={() => {
              if (!disabled) {
                onSelect(color)
                setIsOpen(false)
              }
            }}
            disabled={disabled}
          >
            {applyLabel}
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='flex-1'
            onClick={() => {
              if (!disabled) {
                onClear()
                setIsOpen(false)
              }
            }}
            disabled={disabled}
          >
            {clearLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
