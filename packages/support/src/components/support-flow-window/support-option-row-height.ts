import {
  DETAILED_OPTION_ROW_HEIGHT,
  OPTION_ROW_HEIGHT,
  type SupportOptionListRow,
} from './support-option-list-types'

type GetMeasuredOrEstimatedRowHeightParams = {
  listWidth?: number | null
  measuredHeight: number | undefined
  row: SupportOptionListRow | undefined
}

export function getMeasuredOrEstimatedRowHeight({
  listWidth,
  measuredHeight,
  row,
}: GetMeasuredOrEstimatedRowHeightParams) {
  if (typeof measuredHeight === 'number' && Number.isFinite(measuredHeight)) {
    return measuredHeight
  }

  if (!row) return OPTION_ROW_HEIGHT

  const wrappedLineCount = getWrappedLineCount(row, listWidth)
  const extraLineHeight = row.details.length ? 20 : 24
  const baseHeight = row.details.length
    ? DETAILED_OPTION_ROW_HEIGHT
    : OPTION_ROW_HEIGHT

  return baseHeight + Math.max(0, wrappedLineCount - 1) * extraLineHeight
}

function getWrappedLineCount(
  row: SupportOptionListRow,
  listWidth?: number | null
) {
  const contentWidth = Math.max((listWidth ?? 320) - 72, 160)
  const approximateCharactersPerLine = Math.max(
    Math.floor(contentWidth / 8),
    20
  )

  if (row.option.source === 'selectable-question') {
    return countWrappedLines(row.option.label, approximateCharactersPerLine)
  }

  const displayName = row.option.displayName?.trim()
  const displayNameLineCount =
    displayName && displayName !== row.option.label
      ? countWrappedLines(displayName, approximateCharactersPerLine)
      : 0
  const detailLineCount = getResponseDetailWrappedLineCount(
    row,
    approximateCharactersPerLine
  )

  return (
    countWrappedLines(row.option.label, approximateCharactersPerLine) +
    displayNameLineCount +
    detailLineCount
  )
}

function countWrappedLines(text: string, approximateCharactersPerLine: number) {
  return Math.max(
    1,
    Math.ceil(text.trim().length / approximateCharactersPerLine)
  )
}

function getResponseDetailWrappedLineCount(
  row: SupportOptionListRow,
  approximateCharactersPerLine: number
) {
  const businessKey = row.details.find(
    (detail) => detail.field === 'businessKey'
  )
  const status = row.details.find((detail) => detail.field === 'status')

  return [
    businessKey ? `${businessKey.title}: ${businessKey.value}` : '',
    status?.value ?? '',
  ]
    .filter(Boolean)
    .reduce(
      (lineCount, text) =>
        lineCount + countWrappedLines(text, approximateCharactersPerLine),
      0
    )
}
