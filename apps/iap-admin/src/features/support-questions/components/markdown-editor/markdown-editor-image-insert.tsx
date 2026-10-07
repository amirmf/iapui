import { useState } from 'react'

import { Button, Input } from '@iap/ui'
import type { Editor } from '@tiptap/core'
import { ImagePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getSafeHttpUrl } from './markdown-editor-url'

type MarkdownEditorImageInsertProps = {
  disabled: boolean
  editor: Editor | null
}

export function MarkdownEditorImageInsert({
  disabled,
  editor,
}: MarkdownEditorImageInsertProps) {
  const { t } = useTranslation()
  const [imageUrl, setImageUrl] = useState('')
  const trimmedImageUrl = imageUrl.trim()
  const safeImageUrl = getSafeHttpUrl(trimmedImageUrl)

  const insertImage = () => {
    if (disabled || !safeImageUrl) return

    editor?.chain().focus().setImage({ src: safeImageUrl }).run()
    setImageUrl('')
  }

  return (
    <div className='flex flex-col gap-2 border-t border-border p-2 sm:flex-row'>
      <Input
        type='url'
        value={imageUrl}
        onChange={(event) => setImageUrl(event.target.value)}
        placeholder={t('common.markdownEditor.imageUrlPlaceholder')}
        disabled={disabled}
        aria-label={t('common.markdownEditor.imageUrl')}
      />
      <Button
        type='button'
        variant='outline'
        onClick={insertImage}
        disabled={disabled || !safeImageUrl}
      >
        <ImagePlus />
        {t('common.markdownEditor.insertImage')}
      </Button>
    </div>
  )
}
