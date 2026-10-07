import { useEffect, useState } from 'react'

import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@iap/ui'
import type { Editor } from '@tiptap/core'
import { Link } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getSafeHttpUrl } from './markdown-editor-url'

type MarkdownEditorLinkPopoverProps = {
  disabled: boolean
  editor: Editor | null
}

export function MarkdownEditorLinkPopover({
  disabled,
  editor,
}: MarkdownEditorLinkPopoverProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const trimmedLinkUrl = linkUrl.trim()
  const safeLinkUrl = getSafeHttpUrl(trimmedLinkUrl)

  useEffect(() => {
    if (disabled) setIsOpen(false)
  }, [disabled])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) setLinkUrl(editor?.getAttributes('link').href ?? '')
  }

  const applyLink = () => {
    if (disabled) return

    const chain = editor?.chain().focus().extendMarkRange('link')
    if (!chain) return

    if (!trimmedLinkUrl) {
      chain.unsetLink().run()
      setIsOpen(false)
      return
    }
    if (!safeLinkUrl) return

    chain.setLink({ href: trimmedLinkUrl }).run()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className={
            editor?.isActive('link')
              ? 'size-8 bg-accent p-0 text-accent-foreground'
              : 'size-8 p-0'
          }
          disabled={disabled}
          aria-label={t('common.markdownEditor.link')}
          aria-expanded={isOpen}
        >
          <Link />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-72 p-2'>
        <div className='flex gap-2'>
          <Input
            type='url'
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder={t('common.markdownEditor.linkUrlPlaceholder')}
            aria-label={t('common.markdownEditor.linkUrl')}
            disabled={disabled}
          />
          <Button
            type='button'
            size='sm'
            onClick={applyLink}
            disabled={disabled || (Boolean(trimmedLinkUrl) && !safeLinkUrl)}
          >
            {trimmedLinkUrl
              ? t('common.markdownEditor.applyLink')
              : t('common.markdownEditor.removeLink')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
