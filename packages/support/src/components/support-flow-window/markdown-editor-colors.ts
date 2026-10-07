const hexColorPattern = /^#[\da-f]{6}$/i

export function isMarkdownEditorColor(value: string): boolean {
  return hexColorPattern.test(value)
}
