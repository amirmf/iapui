// @vitest-environment jsdom
import { act, createElement } from 'react'

import { i18n } from '@shared/i18n/i18n'
import { Editor } from '@tiptap/core'
import { type Root, createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MarkdownEditor } from './markdown-editor'
import { isMarkdownEditorColor } from './markdown-editor-colors'
import { markdownEditorExtensions } from './markdown-editor-extensions'
import { isMarkdownEditorFontSize } from './markdown-editor-font-size'
import { normalizeMarkdownEditorTextStyles } from './markdown-editor-text-style'
import { getSafeHttpUrl } from './markdown-editor-url'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let editor: Editor | undefined
let container: HTMLDivElement | undefined
let root: Root | undefined

afterEach(() => {
  editor?.destroy()
  editor = undefined
  act(() => root?.unmount())
  container?.remove()
  container = undefined
  root = undefined
})

function renderMarkdownEditor(
  disabled: boolean,
  onChange: (value: string) => void
) {
  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  }

  act(() => {
    root?.render(
      createElement(
        I18nextProvider,
        { i18n },
        createElement(MarkdownEditor, {
          disabled,
          onChange,
          value: 'Claim details',
        })
      )
    )
  })
}

describe('MarkdownEditor configuration', () => {
  it('loads Markdown and serializes formatted content back to Markdown', () => {
    editor = new Editor({
      extensions: markdownEditorExtensions,
      content:
        '## Claim status\n\n**Approved**\n\n![Claim card](https://example.com/card.png)',
      contentType: 'markdown',
    })

    expect(editor.getMarkdown()).toContain('## Claim status')
    expect(editor.getMarkdown()).toContain('**Approved**')
    expect(editor.getMarkdown()).toContain(
      '![Claim card](https://example.com/card.png)'
    )

    editor
      .chain()
      .focus()
      .setImage({ src: 'https://example.com/next.png' })
      .run()

    expect(editor.getMarkdown()).toContain('![](https://example.com/next.png)')
  })

  it('serializes every supported heading level to Markdown', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      editor = new Editor({
        extensions: markdownEditorExtensions,
        content: `Heading ${level}`,
      })

      editor.chain().focus().toggleHeading({ level }).run()

      expect(editor.getMarkdown()).toContain(
        `${'#'.repeat(level)} Heading ${level}`
      )
      editor.destroy()
      editor = undefined
    }
  })

  it('updates controlled Markdown without emitting an editor update', () => {
    const onUpdate = vi.fn()
    editor = new Editor({
      extensions: markdownEditorExtensions,
      content: 'Initial response',
      contentType: 'markdown',
      onUpdate,
    })
    onUpdate.mockClear()

    editor.commands.setContent('## Reset response', {
      contentType: 'markdown',
      emitUpdate: false,
    })

    expect(editor.getMarkdown()).toContain('## Reset response')
    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('round-trips inline links and text styles through Markdown', () => {
    editor = new Editor({
      extensions: markdownEditorExtensions,
      content: 'Approved claim',
      contentType: 'markdown',
    })

    editor.commands.setTextSelection({ from: 1, to: 9 })
    editor
      .chain()
      .setLink({ href: 'https://example.com/claims/1' })
      .setColor('#1d4ed8')
      .setBackgroundColor('#fef3c7')
      .setFontSize('20px')
      .run()

    const markdown = editor.getMarkdown()
    expect(markdown).toContain('](https://example.com/claims/1)')
    expect(markdown).toContain('color=%231d4ed8')
    expect(markdown).toContain('backgroundColor=%23fef3c7')
    expect(markdown).toContain('fontSize=20px')

    editor.commands.setContent(markdown, { contentType: 'markdown' })
    editor.commands.setTextSelection({ from: 1, to: 2 })
    expect(
      editor.isActive('link', { href: 'https://example.com/claims/1' })
    ).toBe(true)
    expect(editor.getAttributes('textStyle')).toMatchObject({
      backgroundColor: '#fef3c7',
      color: '#1d4ed8',
      fontSize: '20px',
    })
  })

  it('round-trips legacy text-style spans with combined marks when editing', () => {
    editor = new Editor({
      extensions: markdownEditorExtensions,
      content: normalizeMarkdownEditorTextStyles(
        '[<span style="color: #1d4ed8">***Claim details***</span>](https://example.com/claims/1)'
      ),
      contentType: 'markdown',
    })

    expect(editor.getText()).toBe('Claim details')
    expect(editor.isActive('bold')).toBe(true)
    expect(editor.isActive('italic')).toBe(true)
    expect(editor.isActive('link')).toBe(true)
    expect(editor.getAttributes('textStyle')).toMatchObject({
      color: '#1d4ed8',
    })
    expect(editor.getMarkdown()).toBe(
      '[{{tiptap-style:color=%231d4ed8|***Claim details***}}](https://example.com/claims/1)'
    )
    expect(editor.getMarkdown()).not.toContain('\\*')
  })

  it('removes only the link mark and accepts absolute HTTP(S) URLs', () => {
    editor = new Editor({
      extensions: markdownEditorExtensions,
      content: '[Approved](https://example.com/claims/1)',
      contentType: 'markdown',
    })

    editor.commands.setTextSelection({ from: 1, to: 9 })
    editor.chain().extendMarkRange('link').unsetLink().run()

    expect(editor.getMarkdown()).toContain('Approved')
    expect(editor.getMarkdown()).not.toContain(
      '](https://example.com/claims/1)'
    )
    expect(getSafeHttpUrl('https://example.com')).toBe('https://example.com/')
    expect(getSafeHttpUrl('http://example.com')).toBe('http://example.com/')
    expect(getSafeHttpUrl('mailto:support@example.com')).toBeNull()
    expect(getSafeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(getSafeHttpUrl('/claims/1')).toBeNull()
  })

  it('accepts arbitrary opaque hex colors and rejects unsafe CSS values', () => {
    expect(isMarkdownEditorColor('#3b82f6')).toBe(true)
    expect(isMarkdownEditorColor('#A855F7')).toBe(true)
    expect(isMarkdownEditorColor('rgb(59, 130, 246)')).toBe(false)
    expect(isMarkdownEditorColor('red')).toBe(false)
  })

  it('allows only supported font sizes in rendered Markdown', () => {
    expect(isMarkdownEditorFontSize('12px')).toBe(true)
    expect(isMarkdownEditorFontSize('20px')).toBe(true)
    expect(isMarkdownEditorFontSize('13px')).toBe(true)
    expect(isMarkdownEditorFontSize('21px')).toBe(false)
    expect(isMarkdownEditorFontSize('100vh')).toBe(false)
  })

  it('closes formatting popovers and prevents changes when disabled', () => {
    const onChange = vi.fn()
    renderMarkdownEditor(false, onChange)

    const toolbar = document.querySelector('[role="toolbar"]')
    const toolbarButtons =
      toolbar?.querySelectorAll<HTMLButtonElement>('button')
    const linkButton = toolbarButtons?.[toolbarButtons.length - 1]

    expect(linkButton).toBeDefined()
    act(() => linkButton?.click())
    expect(document.querySelectorAll('input[type="url"]')).toHaveLength(2)

    onChange.mockClear()
    renderMarkdownEditor(true, onChange)

    expect(document.querySelectorAll('input[type="url"]')).toHaveLength(1)
    expect(
      [...(toolbar?.querySelectorAll<HTMLButtonElement>('button') ?? [])].every(
        (button) => button.disabled
      )
    ).toBe(true)
    onChange.mockClear()
    act(() => linkButton?.click())
    expect(onChange).not.toHaveBeenCalled()
  })
})
