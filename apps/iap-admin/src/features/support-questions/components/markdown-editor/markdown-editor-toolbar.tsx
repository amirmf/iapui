import { Button } from '@iap/ui'
import type { Editor } from '@tiptap/core'
import {
  Bold,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  Palette,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MarkdownEditorColorMenu } from './markdown-editor-color-menu'
import { isMarkdownEditorFontSize } from './markdown-editor-font-size'
import { MarkdownEditorFontSizeMenu } from './markdown-editor-font-size-menu'
import { MarkdownEditorHeadingMenu } from './markdown-editor-heading-menu'
import { MarkdownEditorLinkPopover } from './markdown-editor-link-popover'

const headingLevels = [1, 2, 3, 4, 5, 6] as const

type MarkdownEditorToolbarProps = {
  disabled: boolean
  editor: Editor | null
}

type ToolbarIconButtonProps = {
  disabled: boolean
  icon: LucideIcon
  isActive: boolean
  label: string
  onClick: () => void
}

function ToolbarIconButton({
  disabled,
  icon: Icon,
  isActive,
  label,
  onClick,
}: ToolbarIconButtonProps) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      className={
        isActive ? 'size-8 bg-accent p-0 text-accent-foreground' : 'size-8 p-0'
      }
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <Icon />
    </Button>
  )
}

export function MarkdownEditorToolbar({
  disabled,
  editor,
}: MarkdownEditorToolbarProps) {
  const { t } = useTranslation()
  const activeHeadingLevel = headingLevels.find((level) =>
    editor?.isActive('heading', { level })
  )
  const headingValue = activeHeadingLevel
    ? `heading-${activeHeadingLevel}`
    : 'paragraph'
  const currentFontSize = editor?.getAttributes('textStyle').fontSize

  const setHeadingLevel = (value: string) => {
    if (value === 'paragraph') {
      editor?.chain().focus().setParagraph().run()
      return
    }

    const level = headingLevels.find(
      (headingLevel) => value === `heading-${headingLevel}`
    )
    if (level) editor?.chain().focus().setHeading({ level }).run()
  }

  return (
    <div
      className='flex flex-wrap items-center gap-1 border-b border-border p-2'
      role='toolbar'
      aria-label={t('common.markdownEditor.toolbar')}
    >
      <ToolbarIconButton
        disabled={disabled}
        icon={Bold}
        isActive={Boolean(editor?.isActive('bold'))}
        label={t('common.markdownEditor.bold')}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      />
      <ToolbarIconButton
        disabled={disabled}
        icon={Italic}
        isActive={Boolean(editor?.isActive('italic'))}
        label={t('common.markdownEditor.italic')}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      />
      <MarkdownEditorHeadingMenu
        value={headingValue}
        disabled={disabled}
        label={t('common.markdownEditor.heading')}
        onValueChange={setHeadingLevel}
      />
      <MarkdownEditorFontSizeMenu
        disabled={disabled}
        label={t('common.markdownEditor.fontSize')}
        value={
          typeof currentFontSize === 'string' &&
          isMarkdownEditorFontSize(currentFontSize)
            ? currentFontSize
            : '13px'
        }
        onValueChange={(fontSize) =>
          editor?.chain().focus().setFontSize(fontSize).run()
        }
      />
      <ToolbarIconButton
        disabled={disabled}
        icon={List}
        isActive={Boolean(editor?.isActive('bulletList'))}
        label={t('common.markdownEditor.bulletList')}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      />
      <ToolbarIconButton
        disabled={disabled}
        icon={ListOrdered}
        isActive={Boolean(editor?.isActive('orderedList'))}
        label={t('common.markdownEditor.orderedList')}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      />
      <MarkdownEditorColorMenu
        disabled={disabled}
        label={t('common.markdownEditor.textColor')}
        applyLabel={t('common.markdownEditor.applyColor')}
        clearLabel={t('common.markdownEditor.clearTextColor')}
        icon={Palette}
        onSelect={(color) => editor?.chain().focus().setColor(color).run()}
        onClear={() => editor?.chain().focus().unsetColor().run()}
      />
      <MarkdownEditorColorMenu
        disabled={disabled}
        label={t('common.markdownEditor.backgroundColor')}
        applyLabel={t('common.markdownEditor.applyColor')}
        clearLabel={t('common.markdownEditor.clearBackgroundColor')}
        icon={Highlighter}
        onSelect={(color) =>
          editor?.chain().focus().setBackgroundColor(color).run()
        }
        onClear={() => editor?.chain().focus().unsetBackgroundColor().run()}
      />
      <MarkdownEditorLinkPopover disabled={disabled} editor={editor} />
    </div>
  )
}
