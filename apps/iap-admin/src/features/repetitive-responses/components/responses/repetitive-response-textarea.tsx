import type {
  ChangeEvent,
  FocusEvent,
  Ref,
  TextareaHTMLAttributes,
} from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { repetitiveResponseService } from '@features/repetitive-responses/services/repetitive-response-service'
import type { RepetitiveResponse } from '@iap/api-types'
import { useDebouncedValue } from '@iap/react-hooks'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  Spinner,
  Textarea,
  cn,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useQuery } from '@tanstack/react-query'

const DEFAULT_MIN_QUERY_LENGTH = 3
const DEFAULT_FETCH_DEBOUNCE_MS = 700
const DEFAULT_MAX_SUGGESTIONS = 20

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(node)
        return
      }
      ref.current = node
    })
  }
}

type BaseTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export interface RepetitiveResponseTextareaProps extends Omit<
  BaseTextareaProps,
  'value'
> {
  value: string
  onValueChange?: (value: string) => void
  isBusy?: boolean
  minQueryLength?: number
  fetchDebounceMs?: number
  maxSuggestions?: number
  textareaRef?: Ref<HTMLTextAreaElement>
}

export function RepetitiveResponseTextarea({
  value,
  onValueChange,
  isBusy = false,
  className,
  minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
  fetchDebounceMs = DEFAULT_FETCH_DEBOUNCE_MS,
  maxSuggestions = DEFAULT_MAX_SUGGESTIONS,
  onFocus,
  onBlur,
  onChange,
  disabled,
  textareaRef: externalRef,
  ...textareaProps
}: RepetitiveResponseTextareaProps) {
  const { t } = useTranslate()
  const translate = t as (
    key: string,
    options?: { count?: number; defaultValue?: string }
  ) => string
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(value ?? '')
  const [suppressPopover, setSuppressPopover] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [anchorWidth, setAnchorWidth] = useState<number>()
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const nextValue = value ?? ''
    if (nextValue !== inputValue) setInputValue(nextValue)
  }, [value, inputValue])

  const trimmedQuery = inputValue.trim()
  const shouldFetch =
    isFocused && !isBusy && trimmedQuery.length >= minQueryLength
  const hasTypedValue = trimmedQuery.length > 0
  const queryTooShort = hasTypedValue && trimmedQuery.length < minQueryLength
  const debouncedQuery = useDebouncedValue(trimmedQuery, fetchDebounceMs)

  const query = useQuery({
    queryKey: ['repetitive-responses', debouncedQuery, maxSuggestions],
    enabled: shouldFetch && debouncedQuery.length >= minQueryLength,
    queryFn: async ({ signal }) => {
      const page = await repetitiveResponseService.getPageFull({
        filters: { description: debouncedQuery },
        page: 0,
        signal,
        size: maxSuggestions,
      })

      return page.content ?? []
    },
    staleTime: 30_000,
    gcTime: 30_000,
    retry: 1,
  })

  useEffect(() => {
    if (query.isError) {
      setError(
        translate('claimRequests.messages.repetitiveResponsesLoadError', {
          defaultValue: 'Unable to load saved responses.',
        })
      )
      return
    }

    setError(null)
  }, [query.isError, translate])

  const suggestions = useMemo(
    () =>
      (query.data ?? []).filter(
        (item) => (item.description ?? '').trim().length > 0
      ),
    [query.data]
  )

  const shouldShowPopover = isFocused && hasTypedValue && !suppressPopover

  useEffect(() => {
    if (!anchorRef.current || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setAnchorWidth(width)
    })

    observer.observe(anchorRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
    },
    []
  )

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current)
        blurTimeoutRef.current = null
      }
      setIsFocused(true)
      onFocus?.(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLTextAreaElement>) => {
      blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 150)
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value
      setInputValue(nextValue)
      if (suppressPopover) setSuppressPopover(false)
      onChange?.(event)
      onValueChange?.(nextValue)
    },
    [onChange, onValueChange, suppressPopover]
  )

  const selectResult = useCallback(
    (item: RepetitiveResponse) => {
      const nextValue = item.description ?? ''
      setInputValue(nextValue)
      onValueChange?.(nextValue)
      setSuppressPopover(true)
      if (textareaRef.current) {
        textareaRef.current.focus()
        onChange?.({
          currentTarget: textareaRef.current,
          target: textareaRef.current,
        } as ChangeEvent<HTMLTextAreaElement>)
      }
      setError(null)
    },
    [onChange, onValueChange]
  )

  const listLabel = translate(
    'claimRequests.dialog.repetitiveResponses.heading',
    {
      defaultValue: 'Saved responses',
    }
  )

  return (
    <Popover open={shouldShowPopover}>
      <PopoverAnchor asChild>
        <div className='w-full' ref={anchorRef}>
          <Textarea
            {...textareaProps}
            className={className}
            disabled={isBusy || disabled}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            ref={mergeRefs(textareaRef, externalRef)}
            value={inputValue}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align='start'
        className='w-full overflow-hidden p-0'
        onCloseAutoFocus={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side='bottom'
        sideOffset={6}
        style={{ width: anchorWidth }}
      >
        {queryTooShort ? (
          <div className='px-3 py-4 text-center text-sm text-muted-foreground'>
            {translate(
              'claimRequests.dialog.repetitiveResponses.queryTooShort',
              {
                count: minQueryLength,
                defaultValue: 'Type a bit more to search saved responses.',
              }
            )}
          </div>
        ) : query.isFetching ? (
          <div className='flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground'>
            <Spinner
              label={translate(
                'claimRequests.dialog.repetitiveResponses.loading'
              )}
              size='sm'
            />
            <span>
              {translate('claimRequests.dialog.repetitiveResponses.loading')}
            </span>
          </div>
        ) : error ? (
          <div className='px-3 py-4 text-sm text-destructive'>{error}</div>
        ) : suggestions.length ? (
          <div className='max-h-60 overflow-y-auto'>
            <ul aria-label={listLabel} className='divide-y'>
              {suggestions.map((item, index) => (
                <li key={item.id ?? `${item.description}-${index}`}>
                  <button
                    className={cn(
                      'flex w-full justify-end px-3 py-2 text-sm transition-colors',
                      'hover:bg-secondary/60'
                    )}
                    onClick={() => selectResult(item)}
                    onMouseDown={(event) => event.preventDefault()}
                    type='button'
                  >
                    <p className='line-clamp-3 whitespace-pre-wrap text-sm'>
                      {item.description}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='px-3 py-4 text-center text-sm text-muted-foreground'>
            {translate('claimRequests.dialog.repetitiveResponses.empty', {
              defaultValue: 'No saved responses match your text.',
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
