import { useEffect, useRef } from 'react'

import { useEditor } from '@tiptap/react'
import { useTranslation } from 'react-i18next'

import { MarkdownEditorContent } from './markdown-editor-content'
import { markdownEditorExtensions } from './markdown-editor-extensions'
import { MarkdownEditorImageInsert } from './markdown-editor-image-insert'
import { normalizeMarkdownEditorTextStyles } from './markdown-editor-text-style'
import { MarkdownEditorToolbar } from './markdown-editor-toolbar'

type MarkdownEditorProps = {
  value: string
  onChange: (markdown: string) => void
  disabled?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  disabled = false,
}: MarkdownEditorProps) {
  const { i18n } = useTranslation()
  const onChangeRef = useRef(onChange)
  const normalizedValue = normalizeMarkdownEditorTextStyles(value)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    extensions: markdownEditorExtensions,
    content: normalizedValue,
    contentType: 'markdown',
    editable: !disabled,
    onUpdate: ({ editor: updatedEditor }) => {
      onChangeRef.current(updatedEditor.getMarkdown())
    },
  })

  useEffect(() => {
    if (!editor || editor.getMarkdown() === normalizedValue) return

    editor.commands.setContent(normalizedValue, {
      contentType: 'markdown',
      emitUpdate: false,
    })
  }, [editor, normalizedValue])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  return (
    <div
      className='rounded-md border border-input bg-background'
      dir={i18n.dir()}
    >
      <MarkdownEditorToolbar disabled={disabled} editor={editor} />
      <MarkdownEditorContent editor={editor} />
      <MarkdownEditorImageInsert disabled={disabled} editor={editor} />
    </div>
  )
}
