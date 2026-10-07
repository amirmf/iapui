import Image from '@tiptap/extension-image'
import {
  BackgroundColor,
  Color,
  FontSize,
  TextStyle,
} from '@tiptap/extension-text-style'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'

import {
  parseMarkdownEditorTextStyleAttributes,
  serializeMarkdownEditorTextStyle,
} from './markdown-editor-text-style'

const MarkdownTextStyle = TextStyle.extend({
  markdownTokenName: 'tiptapStyle',
  markdownTokenizer: {
    name: 'tiptapStyle',
    level: 'inline',
    start: (source) => source.indexOf('{{tiptap-style:'),
    tokenize: (source, _tokens, lexer) => {
      const match = /^\{\{tiptap-style:([^|{}]+)\|([\s\S]*?)\}\}/.exec(source)
      if (!match) return undefined

      return {
        type: 'tiptapStyle',
        raw: match[0],
        styleAttributes: match[1],
        text: match[2],
        tokens: lexer.inlineTokens(match[2]),
      }
    },
  },
  parseMarkdown: (token, helpers) => {
    const style = parseMarkdownEditorTextStyleAttributes(
      typeof token.styleAttributes === 'string' ? token.styleAttributes : ''
    )
    const content = helpers.parseInline(token.tokens ?? [])

    return style ? helpers.applyMark('textStyle', content, style) : content
  },
  renderMarkdown: (node, helpers) => {
    return serializeMarkdownEditorTextStyle(
      {
        backgroundColor: node.attrs?.backgroundColor,
        color: node.attrs?.color,
        fontSize: node.attrs?.fontSize,
      },
      helpers.renderChildren(node)
    )
  },
})

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export const markdownEditorExtensions = [
  StarterKit.configure({
    link: {
      openOnClick: false,
      enableClickSelection: true,
      protocols: ['http', 'https'],
      isAllowedUri: (url) => isSafeHttpUrl(url),
    },
  }),
  Image,
  MarkdownTextStyle,
  Color,
  BackgroundColor,
  FontSize,
  Markdown,
]
