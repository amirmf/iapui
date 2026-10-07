export const markdownEditorFontSizes = [
  '12px',
  '13px',
  '14px',
  '15px',
  '16px',
  '17px',
  '18px',
  '19px',
  '20px',
] as const

const markdownEditorFontSizeSet = new Set<string>(markdownEditorFontSizes)

export function isMarkdownEditorFontSize(value: string): boolean {
  return markdownEditorFontSizeSet.has(value)
}
