import { isMarkdownEditorColor } from './markdown-editor-colors'
import { isMarkdownEditorFontSize } from './markdown-editor-font-size'

export type MarkdownEditorTextStyle = {
  backgroundColor?: string
  color?: string
  fontSize?: string
}

const legacyTextStyleSpanPattern =
  /<span\s+style=(?:"([^"]*)"|'([^']*)')\s*>([\s\S]*?)<\/span>/gi

export const markdownEditorTextStylePattern =
  /\{\{tiptap-style:([^|{}]+)\|([\s\S]*?)\}\}/g

export function parseMarkdownEditorTextStyle(
  value: string
): MarkdownEditorTextStyle | null {
  const style: MarkdownEditorTextStyle = {}
  const declarations = value.split(';').filter(Boolean)

  if (!declarations.length || declarations.length > 3) return null

  for (const declaration of declarations) {
    const [property, styleValue, ...extra] = declaration.split(':')
    const normalizedValue = styleValue?.trim().toLowerCase()

    if (extra.length || !property || !normalizedValue) return null

    if (property.trim() === 'color') {
      if (!isMarkdownEditorColor(normalizedValue) || style.color) return null
      style.color = normalizedValue
      continue
    }

    if (property.trim() === 'background-color') {
      if (!isMarkdownEditorColor(normalizedValue) || style.backgroundColor) {
        return null
      }
      style.backgroundColor = normalizedValue
      continue
    }

    if (property.trim() === 'font-size') {
      if (!isMarkdownEditorFontSize(normalizedValue) || style.fontSize) {
        return null
      }
      style.fontSize = normalizedValue
      continue
    }

    return null
  }

  return style
}

export function parseMarkdownEditorTextStyleAttributes(
  value: string
): MarkdownEditorTextStyle | null {
  const parameters = new URLSearchParams(value)
  const declarations: string[] = []

  for (const [name, parameterValue] of Array.from(parameters.entries())) {
    if (name === 'color') {
      declarations.push(`color: ${parameterValue}`)
      continue
    }
    if (name === 'backgroundColor') {
      declarations.push(`background-color: ${parameterValue}`)
      continue
    }
    if (name === 'fontSize') {
      declarations.push(`font-size: ${parameterValue}`)
      continue
    }

    return null
  }

  return parseMarkdownEditorTextStyle(declarations.join(';'))
}

export function serializeMarkdownEditorTextStyle(
  style: MarkdownEditorTextStyle,
  content: string
): string {
  const validatedStyle = parseMarkdownEditorTextStyle(
    [
      style.color ? `color: ${style.color}` : null,
      style.backgroundColor
        ? `background-color: ${style.backgroundColor}`
        : null,
      style.fontSize ? `font-size: ${style.fontSize}` : null,
    ]
      .filter(Boolean)
      .join(';')
  )

  if (!validatedStyle) return content

  const parameters = new URLSearchParams()
  if (validatedStyle.color) parameters.set('color', validatedStyle.color)
  if (validatedStyle.backgroundColor) {
    parameters.set('backgroundColor', validatedStyle.backgroundColor)
  }
  if (validatedStyle.fontSize)
    parameters.set('fontSize', validatedStyle.fontSize)

  return `{{tiptap-style:${parameters.toString()}|${content}}}`
}

export function normalizeMarkdownEditorTextStyles(value: string): string {
  return value.replace(
    legacyTextStyleSpanPattern,
    (
      match,
      doubleQuotedStyle: string | undefined,
      singleQuotedStyle: string | undefined,
      content: string
    ) => {
      const style = parseMarkdownEditorTextStyle(
        doubleQuotedStyle ?? singleQuotedStyle ?? ''
      )

      return style ? serializeMarkdownEditorTextStyle(style, content) : match
    }
  )
}
