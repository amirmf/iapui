import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { List, type ListImperativeAPI, useDynamicRowHeight } from 'react-window'

import {
  type SupportFlowListItem,
  type SupportFlowOption,
} from '../support-flow-types'
import { useSupportOptionDetails } from './support-option-details'
import {
  LIST_VERTICAL_PADDING,
  OPTION_ROW_GAP,
  OPTION_ROW_HEIGHT,
  type SupportOptionListRow,
} from './support-option-list-types'
import { SupportOptionRow } from './support-option-row'
import { getMeasuredOrEstimatedRowHeight } from './support-option-row-height'

type SupportOptionListProps = {
  options: SupportFlowListItem[]
  disabled?: boolean
  hasMoreOptions?: boolean
  isLoadingMoreOptions?: boolean
  onLoadMore?: () => void
  onSelect: (option: SupportFlowOption) => void
}

export function SupportOptionList(props: SupportOptionListProps) {
  const {
    options,
    disabled,
    hasMoreOptions = false,
    isLoadingMoreOptions = false,
    onLoadMore,
    onSelect,
  } = props
  const { t } = useTranslation()
  const listRef = useRef<ListImperativeAPI>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [remainingHeight, setRemainingHeight] = useState<number | null>(null)
  const [listWidth, setListWidth] = useState<number | null>(null)
  const getOptionDetails = useSupportOptionDetails()

  const rows = useMemo<SupportOptionListRow[]>(
    () =>
      options.map((option) => ({
        details: getOptionDetails(option),
        option,
      })),
    [getOptionDetails, options]
  )

  const firstOptionKey = rows[0]?.option.key
  const loadingRowIndex = isLoadingMoreOptions ? rows.length : null
  const rowCount = rows.length + (isLoadingMoreOptions ? 1 : 0)
  const rowHeightKey = rows.map((row) => row.option.key).join('|')
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: OPTION_ROW_HEIGHT,
    key: `${rowHeightKey}:${listWidth ?? 'auto'}:${rowCount}`,
  })

  const getItemSize = useCallback(
    (index: number) => {
      const row = rows[index]

      return (
        getMeasuredOrEstimatedRowHeight({
          listWidth,
          measuredHeight: dynamicRowHeight.getRowHeight(index),
          row,
        }) + (index === rows.length - 1 ? 0 : OPTION_ROW_GAP)
      )
    },
    [dynamicRowHeight, listWidth, rows]
  )

  const contentHeight = useMemo(
    () =>
      Array.from({ length: rowCount }).reduce<number>(
        (height, _row, index) => height + getItemSize(index),
        0
      ) + LIST_VERTICAL_PADDING,
    [getItemSize, rowCount]
  )

  const listHeight = remainingHeight
    ? Math.min(contentHeight, remainingHeight)
    : contentHeight

  const rowProps = useMemo(
    () => ({
      disabled,
      loadingRowIndex,
      onSelect,
      rows,
    }),
    [disabled, loadingRowIndex, onSelect, rows]
  )

  const handleRowsRendered = useCallback(
    ({ stopIndex }: { startIndex: number; stopIndex: number }) => {
      if (
        stopIndex >= rows.length - 1 &&
        hasMoreOptions &&
        !isLoadingMoreOptions
      ) {
        onLoadMore?.()
      }
    },
    [hasMoreOptions, isLoadingMoreOptions, onLoadMore, rows.length]
  )

  useEffect(() => {
    listRef.current?.scrollToRow({ index: 0 })
  }, [firstOptionKey])

  useEffect(() => {
    const element = wrapperRef.current
    const scrollContainer = element?.parentElement

    if (!element || !scrollContainer) return

    const updateRemainingHeight = () => {
      const elementRect = element.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()
      const padding = 20
      const availableHeight = Math.floor(
        containerRect.bottom - elementRect.top - padding
      )

      setRemainingHeight(Math.max(OPTION_ROW_HEIGHT, availableHeight))
      setListWidth(Math.floor(elementRect.width))
    }

    updateRemainingHeight()

    const resizeObserver = new ResizeObserver(updateRemainingHeight)
    resizeObserver.observe(scrollContainer)
    resizeObserver.observe(element)
    window.addEventListener('resize', updateRemainingHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateRemainingHeight)
    }
  }, [contentHeight])

  return (
    <div ref={wrapperRef} className='min-h-0 flex-1'>
      <List
        aria-label={t('supportFlow.optionListLabel')}
        className='support-option-list [scrollbar-width:thin]'
        defaultHeight={listHeight}
        listRef={listRef}
        overscanCount={3}
        rowComponent={SupportOptionRow}
        onRowsRendered={handleRowsRendered}
        rowCount={rowCount}
        rowHeight={dynamicRowHeight}
        rowProps={rowProps}
        style={{
          height: `${listHeight}px`,
          maxHeight: remainingHeight ? `${remainingHeight}px` : undefined,
          width: '100%',
          padding: '8px 0',
        }}
      />
    </div>
  )
}
